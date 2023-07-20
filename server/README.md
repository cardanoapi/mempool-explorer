# Mempool Explorer Web Application (Websocket server)

## Components

- Kafka: Mempool events are consumed from the Kafka topic and parsed accordingly.
- Websocket: The Websocket server is used to send CBOR encoded data, which contains mempool events immediately after consuming from Kafka.
- In-memory Mempool: The Mempool state is recorded in memory to check for the same event twice, which won't be exposed to the websocket.

## How to Run

1. Clone this repository.
2. Run `yarn install` to install the required dependencies.
3. Create a `.env` file and add the following variables as mentioned below:
   - `KAFKA_BROKERS`
   - `KAFKA_TOPIC_NAME`
   - `KAFKA_GROUP_ID`
   - `KAFKA_BLOCK_TOPIC_NAME`
   - `KAFKA_BLOCK_GROUP_ID`
   - `DATABASE_URL` (e.g., `postgresql://test:test@localhost:5432/test?schema=public`)
4. Generate models in Prisma client by running `npx prisma generate`.
5. Start the development server with `yarn run dev`.

## .env Variables

Make sure to set the following environment variables in the `.env` file:

- `KAFKA_BROKERS`: The list of Kafka brokers to connect to separated by `,`
- `KAFKA_TOPIC_NAME`: The name of the Kafka topic to consume mempool events from.
- `KAFKA_GROUP_ID`: The ID of the Kafka consumer group for mempool events.
- `KAFKA_BLOCK_TOPIC_NAME`: The name of the Kafka topic to consume block events from.
- `KAFKA_BLOCK_GROUP_ID`: The ID of the Kafka consumer group for block events.
- `DATABASE_URL`: The connection URL for the PostgreSQL database, which includes the necessary authentication and connection information.
