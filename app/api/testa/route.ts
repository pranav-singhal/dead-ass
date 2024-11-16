import { NextRequest, NextResponse } from 'next/server';
// import { sendMessage } from '../xmtp/message';

import { Client } from "@xmtp/xmtp-js";


console.log("Client", Client);

// export async function sendMessage(
//     recipientAddress: string,
//     message: string
// ) {

//     try {
//         const privateKey = process.env.WALLET_PRIVATE_KEY;
//         if (!privateKey) {
//             return true;
//         }

//         console.log("sending message....");
//         // Create the XMTP client with the wallet from env
//         const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string); // Use key from .env   
//         const xmtp = await Client.create(signer, {
//             env: "production",
//         });

//         // Check if recipient can receive messages
//         const canMessage = await xmtp.canMessage([recipientAddress]);
//         if (!canMessage) {
//             throw new Error("Recipient is not on XMTP network");
//         }

//         // Create a new conversation
//         const conversation = await xmtp.conversations.newConversation(recipientAddress);

//         // Send message
//         const sent = await conversation.send(message);

//         return {
//             success: true,
//             message: "Message sent successfully",
//             data: sent
//         };

//     } catch (error) {
//         return {
//             success: false,
//             message: error instanceof Error ? error.message : "Failed to send message",
//             error
//         };
//     }
// }

export async function POST(request: NextRequest) {
    console.log("API route hit");

    try {
        // const res = await request.json();
        console.log("Request body:");

        // await sendMessage(
        //     "0x3652100A92464777046001b0b42a099EAB1AC64c",
        //     "Hello, world!"
        // );
        // console.log("XMTP response:", _response);

        return NextResponse.json({ message: 'Post received successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error in /api/test route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
