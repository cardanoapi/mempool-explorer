// import {Server} from "socket.io";
//
// export default function handler(req: any, res: any) {
//     if (res.socket.server.io) {
//         console.log("socket already running...")
//     } else {
//         console.log("socket is initializing...")
//         const io = new Server(res.socket.server);
//         res.socket.server.io = io;
//
//         io.on("connection", socket => {
//             socket.broadcast.emit("newIncomingMessage", "ping")
//         })
//
//         io.listen(8080)
//     }
//     res.end();
// }