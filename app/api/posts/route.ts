import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import green from '../../lib/actions/codes/green';
import red from '../../lib/actions/codes/red';
import { classifyText, SafetyCode } from '../../lib/openai';

interface Segment {
    text: string;
    speaker: string;
    speaker_id: number;
    is_user: boolean;
    person_id: null | string;
    start: number;
    end: number;
    safety_code?: SafetyCode;
}

interface WebhookPayload {
    segments: Segment[];
    session_id: string;
}

interface BufferedConversation {
    segments: Segment[];
    fullText: string;
    session_id: string;
}

declare global {
    var connections: Set<WritableStreamDefaultWriter>;
    var messageBuffer: Record<string, BufferedConversation>;
}

if (!global.messageBuffer) {
    global.messageBuffer = {};
}

function shouldStreamMessage(text: string): boolean {
    return text.split(' ').length >= 6;
}

async function streamBufferedMessages(sessionId: string) {
    if (!global.messageBuffer[sessionId]) return;

    const bufferedConv = global.messageBuffer[sessionId];

    if (bufferedConv.segments.length > 0 && shouldStreamMessage(bufferedConv.fullText)) {
        console.log('Classifying full text:', bufferedConv.fullText);

        const safety_code = await classifyText(bufferedConv.fullText);
        console.log('Classification result:', safety_code);
        switch (safety_code) {
            case 'code red':
                red();
                break;
            case 'code green':
                green();
                break;
            case 'code blue':
                red();
                break;
            default:
                green();
        }

        const payload = {
            segments: [{
                text: bufferedConv.fullText,
                speaker: "combined",
                speaker_id: 0,
                is_user: false,
                person_id: null,
                start: bufferedConv.segments[0].start,
                end: bufferedConv.segments[bufferedConv.segments.length - 1].end,
                safety_code
            }],
            session_id: sessionId,
            fullText: bufferedConv.fullText
        };

        const encoder = new TextEncoder();
        const data = `data: ${JSON.stringify(payload)}\n\n`;

        global.connections?.forEach(writer => {
            writer.write(encoder.encode(data));
        });

        // Clear the buffer after streaming
        global.messageBuffer[sessionId] = {
            segments: [],
            fullText: '',
            session_id: sessionId
        };
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: WebhookPayload = await request.json();
        console.log("payload body", body);

        // Initialize buffer for this session if it doesn't exist
        if (!global.messageBuffer[body.session_id]) {
            global.messageBuffer[body.session_id] = {
                segments: [] as Segment[],
                fullText: '',
                session_id: body.session_id
            };
        } else if (!Array.isArray(global.messageBuffer[body.session_id].segments)) {
            // Ensure segments is an array even for existing sessions
            global.messageBuffer[body.session_id].segments = [];
        }

        const bufferedConv = global.messageBuffer[body.session_id];

        // Process each segment
        body.segments.forEach(segment => {
            // Add segment to array
            bufferedConv.segments.push(segment);

            // Add to the full text for classification
            bufferedConv.fullText += ' ' + segment.text;
        });

        // Trim any leading/trailing spaces from the full text
        bufferedConv.fullText = bufferedConv.fullText.trim();

        // Try to stream messages that meet the criteria
        await streamBufferedMessages(body.session_id);

        return NextResponse.json({ message: 'Post received successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Error processing request' },
            { status: 400 }
        );
    }
} 