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
    segments: Record<string, Segment>;  // Using speaker as key
    fullText: string;  // Concatenated text for classification
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
    return text.split(' ').length >= 10;
}

async function streamBufferedMessages(sessionId: string) {
    if (!global.messageBuffer[sessionId]) return;

    const bufferedConv = global.messageBuffer[sessionId];
    const segments = Object.values(bufferedConv.segments);

    if (segments.length > 0 && shouldStreamMessage(bufferedConv.fullText)) {
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

            default:
                green();
        }

        const segmentsToStream = segments.map(seg => ({
            ...seg,
            safety_code
        }));

        const payload = {
            segments: segmentsToStream,
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
            segments: {},
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
                segments: {},
                fullText: '',
                session_id: body.session_id
            };
        }

        const bufferedConv = global.messageBuffer[body.session_id];

        // Process each segment
        body.segments.forEach(segment => {
            if (!bufferedConv.segments[segment.speaker]) {
                bufferedConv.segments[segment.speaker] = { ...segment };
            } else {
                bufferedConv.segments[segment.speaker].text += ' ' + segment.text;
                bufferedConv.segments[segment.speaker].end = segment.end;
            }

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