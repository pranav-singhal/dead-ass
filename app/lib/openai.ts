import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export type SafetyCode = 'code green' | 'code yellow' | 'code red' | 'code blue';

const SYSTEM_PROMPT = `You are a physical safety classifier monitoring real-time conversations for dangerous situations. Analyze the text and classify it into one of these categories:

"code green" - User is safe. Normal conversation or situation with no signs of danger or threat.

"code yellow" - User is in a potentially unsafe situation, such as:
- Being followed
- Verbal harassment
- Suspicious activity nearby
- Minor accidents without injury
- Getting lost
- Uncomfortable social situations

"code red" - User is in immediate danger, such as:
- Active robbery or theft ("give me your wallet", "hand over your phone")
- Physical threats or assault
- Being chased or stalked
- Vehicle accidents with minor injuries
- Being trapped or stranded in unsafe conditions

"code blue" - User is in a life-threatening emergency, such as:
- Severe injuries or bleeding
- Major car accidents ("I'm bleeding", "car is totaled")
- Medical emergencies (heart attack, stroke symptoms)
- Weapon-related threats
- Severe environmental dangers (fire, flood)

Respond only with the classification code, nothing else. Always prioritize user safety - if in doubt, escalate to a higher code level.`;

export async function classifyText(text: string): Promise<SafetyCode> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: text }
            ],
            temperature: 0,
            max_tokens: 10
        });

        const classification = response.choices[0].message.content?.toLowerCase().trim() as SafetyCode;

        // Validate the response
        const validCodes: SafetyCode[] = ['code green', 'code yellow', 'code red', 'code blue'];
        if (!validCodes.includes(classification)) {
            console.error('Invalid classification received:', classification);
            return 'code green'; // Default to safe if invalid response
        }

        return classification;
    } catch (error) {
        console.error('Error classifying text:', error);
        return 'code green'; // Default to safe in case of error
    }
} 