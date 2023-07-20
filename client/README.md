# Mempool Explorer Web Application (Next.js)

This is a web application built using Next.js and Express for exploring and analyzing the transaction mempool of the Cardano blockchain network in real-time.

## Features

-   Real-time Monitoring: Stay updated with the latest transactions in the Cardano mempool.
-   Transaction Details: Access comprehensive information about individual transactions.
-   Historical Data: Explore past mempool activity and gain insights into transaction dynamics over time.
-   API Integration: Retrieve mempool data programmatically using the provided API.

## Getting Started

 - Clone the repository: `git clone git@git.sireto.io:cardano/mempool-explorer-webapp.git`
 - `yarn install` to install required dependencies
 - create .env file and add the required variables as mentioned below
 - use `npx prisma generate` to generate a Prisma client based on your Prisma schema
 - `yarn run dev` to start the development server

## Environment variables

| Environment variables | Description                    | Example                                                     |
|-----------------------|--------------------------------|-------------------------------------------------------------|
| DATABASE_URL          | Connection string for database | postgresql://user:pwd@host:5432/database_name?schema=public |
| NEXT_PUBLIC_WS_URL    | Websocket url                  | ws://localhost:8080/ws                                      |


## Acknowledgements

-   [Cardano](https://www.cardano.org) - The blockchain platform powering the Cardano network.
-   [Next.js](https://nextjs.org) - The React framework used for building this web application.

## Contact

For any inquiries or feedback, please contact [sudip@sireto.io]().
