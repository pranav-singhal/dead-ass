import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '../xmtp/message';

export async function POST(request: NextRequest) {
    console.log("API route hit");

    try {
        // const res = await request.json();
        // console.log("Request body:", res);

        const response = await sendMessage();
        console.log("XMTP response:", response);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error in /api/test route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
