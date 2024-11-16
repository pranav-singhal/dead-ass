import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '../../lib/actions/xmtp/message';

export async function POST(request: NextRequest) {
    console.log("API route hit");

    try {
        const res = await request.json();
        console.log("Request body:", res);

        const response = await sendMessage(
            "0x3652100A92464777046001b0b42a099EAB1AC64c",
            "Hello, world!"
        );
        console.log("XMTP response:", response);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error in /api/xmtp-test route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 