import { NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

if (!global.io) {
    global.io = new SocketIOServer({
        path: '/api/socketio',
    });
}
io = global.io;

export function GET(req: NextRequest, res: NextApiResponse) {
    if (!res.socket.server.io) {
        res.socket.server.io = io;
    }

    res.end();
} 