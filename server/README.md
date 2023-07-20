<h2> Mempool Explorer Web Application (Websocket server) </h2>
<h3>Components</h3> 
<hr>
<ul> Kafka: Mempool events are consumed from kakfa topic and parsed accordingly. </ul>
<ul> Websocket: Websocket server is used to send cbor encoded data which contains mempool events immediately after consuming from kafka. </ul>
<ul> In memory mempool: Mempool state is recorded in the memory to check for same event twice which won't be exposed to the websocket </ul>

<h3> How to run </h3>
<hr>
<ul>Clone this repository </ul>
<ul>``yarn install`` to install required dependencies</ul>
<ul>Create .env file and add the variables as mentioned below</ul>
<ul>``npx prisma generate`` to generate models in prisma client</ul>
<ul>``yarn run dev`` to start the development server</ul>

<h3> .env variables </h3>
<hr>
<ul>KAFKA_BROKERS</ul>
<ul>KAFKA_TOPIC_NAME</ul>
<ul> KAFKA_GROUP_ID</ul>
<ul> KAFKA_BLOCK_TOPIC_NAME</ul>
<ul> KAFKA_BLOCK_GROUP_ID</ul>
<ul> DATABASE_URL (postgresql://test:test@localhost:5432/test?schema=public)</ul>