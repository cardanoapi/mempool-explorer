import * as express from 'express';
import { consumer as consumerMaker, kafkaClient } from './kafkaconsumer';
import {EventType, AddTx, RemoveTx} from './types';
import {Message, Offset} from 'kafka-node';
import { Mempool } from './mempool';

const app = express();
const PORT = 3000;

let localMempool  = new Mempool();

app.get('/', (req, res) => {
    console.log("local mempool state:");
    console.log(localMempool.state);
    res.send(localMempool.state);
});

app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

let offset = new Offset(kafkaClient);
offset.fetchLatestOffsets([process.env.KAFKA_TOPIC_NAME],(err,data)=>{

    const kafkaConsumer = consumerMaker(data[process.env.KAFKA_TOPIC_NAME]['0']);
    kafkaConsumer.on("message",(msg)=>{
        if(msg.key.includes("add")){
            let addTx = EventType.from_add(msg.key, msg.value);
            localMempool.addTx(addTx.txhash, addTx.txbody);
        }
        else if(msg.key.includes("remove")){
            let removeTx = EventType.from_remove(msg.key, msg.value);
            localMempool.removeTx(removeTx.txhashList);
        }
        else if (msg.key.includes("reject")){
            console.log("reject");
            // publish this event to the client
        }
    })
});
