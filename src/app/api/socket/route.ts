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