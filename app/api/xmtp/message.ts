export async function sendMessage({ message }: { message: string }) {

    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "address": "0x3652100A92464777046001b0b42a099EAB1AC64c",
            message
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const response = await fetch("http://localhost:3001/send-message", requestOptions)
        const text = await response.text();
        console.log(text);

    } catch (error) {
        console.error("Error in /api/xmtp/message route:", error);
    }
}