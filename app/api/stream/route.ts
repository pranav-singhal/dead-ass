import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Store the writer in global state to be used by the POST endpoint
    if (!global.connections) {
        global.connections = new Set<WritableStreamDefaultWriter>();
    }
    global.connections.add(writer);

    request.signal.addEventListener('abort', () => {
        global.connections.delete(writer);
        writer.close();
    });

    const response = new Response(stream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });

    return response;
}