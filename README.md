
# Mempool Explorer
This monorepo contains api, websocket-server and frontend application source code for mempool explorer at [mempool.cardanoapi.io](https://mempool.cardanoapi.io).

For the complete setup of the application. We need to run client, api and server respectively. The environment variables required for running each application is given on the respective directories.

### Folder Structure
- **api** - Connects with the mempool database and run quries for  data required by the frontend and exposes via rest endpoints. It is built on express.
How to run api :
https://github.com/cardanoapi/mempool-explorer/blob/main/api/README.md

- **client** - Mempool explorer frontend application built on Next.JS, Chart.js and tailwindcss.
How to run client:
https://github.com/cardanoapi/mempool-explorer/tree/main/client#readme
- **server** - Connects with the kafka server for listening mempool transactions and exposes websocket endpoint for the client to listen to mempool events.
How to run server:
https://github.com/cardanoapi/mempool-explorer/tree/main/server

After running all three components 
the access the mempool frontend via
http://localhost:3000

### Features
Currently mempool explorer supports following features :

- Current epoch information
- Transaction wait time graphs
- Recent mempool size information
- Live mempool viewer
- Track mempool transaction
- Statistics for pools
- Pool distribution graph
