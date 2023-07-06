import * as express from 'express';
import { Throttle } from './lib/throttler';
import { consumer as consumerMaker, kafkaClient } from './kafkaconsumer';
import { addMessage, processedMessage } from './offset-committer';
import {EventType, AddTx, RemoveTx} from './types';
import {Message, Offset} from 'kafka-node';
import logger from './lib/logger';
import { Mempool } from './mempool';

const app = express();
const PORT = 3000;
let throttler: Throttle<EventType> = new Throttle(1, true);

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
    throttler.on("hungry",()=> kafkaConsumer.resume())
    throttler.on("satiated",()=>  kafkaConsumer.pause())

    console.log(data);
    kafkaConsumer.on("message",(msg)=>{
        console.log(msg);
        addMessage(msg);
        if(msg.key.includes("add")){
            throttler.addMessage(EventType.from_add(msg.key, msg.value));
        }
        else if(msg.key.includes("remove")){
            throttler.addMessage(EventType.from_remove(msg.key, msg.value));
        }
    })
    throttler.on("message",(msg:EventType,cb)=>{
        if(msg instanceof AddTx){
            localMempool.addTx(msg.txhash, msg.txbody);
        }
        else if(msg instanceof RemoveTx){
            localMempool.removeTx(msg.txhashList);
        }

    });
    throttler.on("processed",(msg:Message)=>{
        // add some offset commit logic here.
        processedMessage(msg,(offsetNo)=>{
            offset.commit(process.env.KAFKA_GROUP_ID,[{topic:process.env.KAFKA_TOPIC_NAME, offset:offsetNo}], (err, data)=>{  
                if(err){
                    logger.warn("[Kafka-Offset-Commit-Error] "+ err.message,err )
                }
                else{
                    logger.log("[Kafka-Offset-Commit] "+ offsetNo + " committed.")
                }
            });
        });
    });
    console.log("starting throttler");
    throttler.start();
});
