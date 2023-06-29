// const {createServer} = require('http')
// // @ts-ignore
// const WebSocket = require("ws")
// const {parse} = require('url')
// const next = require('next')
//
// const dev = process.env.NODE_ENV !== 'production'
// const app = next({dev})
// const handle = app.getRequestHandler()
//
// app.prepare().then(() => {
//     const server = createServer((req: any, res: any) => handle(req, res, parse(req.url, true)))
//     const wss = new WebSocket.Server({noServer: true})
//
//     wss.on("connection", async function connection(ws: any) {
//         console.log('incoming connection', ws);
//         ws.onclose = () => {
//             console.log('connection closed', wss.clients.size);
//         };
//     });
//
//     server.on('upgrade', function (req: any, socket: any, head: any) {
//         const {pathname} = parse(req.url, true);
//         if (pathname !== '/_next/webpack-hmr') {
//             wss.handleUpgrade(req, socket, head, function done(ws) {
//                 wss.emit('connection', ws, req);
//             });
//         }
//     });
//
//     const port = 3001;
//
//     server.listen(port, (err: any) => {
//         if (err) throw err
//         console.log(`> Ready on http://localhost:${port} and ws://localhost:${port}`)
//     })
// })


// import {Server} from 'socket.io';
//
// const SocketHandler = (req: any, res: any) => {
//     console.log("socket handler!!")
//     if (res.socket.server.io) {
//         console.log('Socket is already running')
//     } else {
//         console.log('Socket is initializing')
//         const io = new Server(res.socket.server)
//         res.socket.server.io = io
//         io.listen(3000);
//     }
//     res.end()
// }


import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});


// import {Server} from 'socket.io'

// const SocketHandler = (req: any, res: any) => {
//     if (res.socket.server.io) {
//         console.log('Socket is already running')
//     } else {
//         console.log('Socket is initializing')
//         const io = new Server(res.socket.server)
//         res.socket.server.io = io
//
//         io.on('connection', socket => {
//             socket.on('input-change', msg => {
//                 socket.broadcast.emit('update-input', msg)
//             })
//         })
//
//         io.listen(8080)
//     }
//     res.end()
// }
//
// export default SocketHandler

