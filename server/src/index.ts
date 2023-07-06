import * as express from 'express';
import { consumer as consumerMaker, kafkaClient } from './kafkaconsumer';
import {EventType, AddTx, RemoveTx} from './types';
import {Message, Offset} from 'kafka-node';
import { Mempool } from './mempool';
import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { v4 } from 'uuid';
import * as cbor from 'cbor';

const app = express();
const PORT = 8080;

let localMempool  = new Mempool();

let expressserver = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})

const wss = new WebSocket.Server({ server: expressserver

});

let connections = {};

wss.on('connection', (ws: WebSocket, req:IncomingMessage) => {
    console.log("new connection");
    if(req.url == "/ws"){
        let id = v4();
        connections[id] = ws;
        ws[id] = id;
        ws.on("close",()=>{
            console.log("connection closed");  
            delete connections[id];
        });
    }
});


app.get('/', (req, res) => {
    console.log("local mempool state:");
    console.log(localMempool.state);
    res.send(localMempool.state);
});



let offset = new Offset(kafkaClient);
offset.fetchLatestOffsets([process.env.KAFKA_TOPIC_NAME],(err,data)=>{

    const kafkaConsumer = consumerMaker(data[process.env.KAFKA_TOPIC_NAME]['0']);
    kafkaConsumer.on("message",(msg)=>{
        let cborlen = Buffer.from([0x83]);
        const key = (msg.key as string).split(':');
        const cborkey = cbor.encode(key[0]);
        let totaldata;

        if((msg.key as string).startsWith("add")){    
            let addTx = EventType.from_add(msg.key, msg.value);
            localMempool.addTx(addTx.txhash, addTx.txbody);
            totaldata = Buffer.concat([cborlen, cborkey, cbor.encode(key[1]), (msg.value as Buffer)]);
        }
        else if((msg.key as string).startsWith("remove")){
            cborlen = Buffer.from([0x82]);
            let removeTx = EventType.from_remove(msg.key, msg.value);
            localMempool.removeTx(removeTx.txhashList);
            totaldata = Buffer.concat([cborlen, cborkey, (msg.value as Buffer)]);
        }
        else if((msg.key as string).startsWith("reject")){
            console.log("reject");
            totaldata = Buffer.concat([cborlen, cborkey, cbor.encode(key[1]), (msg.value as Buffer)]);
            // publish this event to the client
        }
        Object.values(connections).forEach((connection:WebSocket & {id:number}) => {
            
            console.log(totaldata.toString('hex'));
            connection.send(totaldata, (err) => {
                if(err){
                    console.log("error sending message to client");
                    delete connections[connection.id]; 
                }
            });
        });

    })
});
