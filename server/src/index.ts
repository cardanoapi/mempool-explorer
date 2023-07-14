import * as express from "express";
import {
  consumer as consumerMaker,
  kafkaClient,
  blockConsumer,
} from "./kafkaconsumer";
import { EventType, AddTx, RemoveTx } from "./types";
import { Message, Offset } from "kafka-node";
import { Mempool } from "./mempool";
import * as WebSocket from "ws";
import { IncomingMessage } from "http";
import { v4 } from "uuid";
import * as cbor from "cbor";
import * as blake2b from "blake2";

const app = express();
const PORT = 8080;

let localMempool = new Mempool();

let expressserver = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const wss = new WebSocket.Server({ server: expressserver });

let connections = {};

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  console.log("new connection");
  if (req.url == "/ws") {
    let id = v4();
    connections[id] = ws;
    ws[id] = id;
    ws.on("close", () => {
      console.log("connection closed");
      delete connections[id];
    });
  }
});

app.get("/", (req, res) => {
  console.log("local mempool state:");
  console.log(localMempool.state);
  res.send(localMempool.state);
});

let offset = new Offset(kafkaClient);
offset.fetchLatestOffsets(
  [process.env.KAFKA_TOPIC_NAME],
  (er, mempoolOffset) => {
    offset.fetchLatestOffsets(
      [process.env.KAFKA_BLOCK_TOPIC_NAME],
      (err, blockoffset) => {
        if (er | err) {
          console.log(
            "Error fetching offsets. Make sure the topics exist in the kafka cluster"
          );
          return;
        }
        console.log(mempoolOffset, blockoffset);
        const kafkaConsumer = consumerMaker(
          mempoolOffset[process.env.KAFKA_TOPIC_NAME],
          blockoffset[process.env.KAFKA_BLOCK_TOPIC_NAME]
        );
        // const blockKafkaConsumer = blockConsumer(blockoffset[process.env.KAFKA_BLOCK_TOPIC_NAME]['0']);
        kafkaConsumer.on("message", (msg) => {
          console.log(msg.topic, msg.offset);
          if (msg.topic == process.env.KAFKA_BLOCK_TOPIC_NAME) {
            let txHashes = [];
            let cb = cbor.decodeFirstSync(msg.key, {
              tags: {
                0: (val) => {
                  return [0, val];
                },
                1: (val) => {
                  return [1, val];
                },
                2: (val) => {
                  return [2, val];
                },
              },
            });
            if (cb[0] == 0) {
              txHashes = ["rollbackToGenesis"];
            } else if (cb[0] == 2) {
              txHashes = ["rollback", cb[1][0], cb[1][1]];
            } else if (cb[0] == 1) {
              if (msg.value.length != 0) {
                txHashes = cbor.decodeFirstSync(msg.value).map((tx: Buffer) => {
                  const hash = blake2b
                    .createHash("blake2b", { digestLength: 32 })
                    .update(cbor.encode(cbor.decodeFirstSync(tx)[0]))
                    .digest();
                  return hash;
                });
              }
              txHashes = ["mint", cb[1][0], cb[1][1], txHashes];
            }
            Object.values(connections).forEach((connection:WebSocket & {id:number}) => {
                  
                  connection.send(cbor.encode(txHashes), (err) => {
                      if(err){
                          console.log("error sending message to client");
                          delete connections[connection.id]; 
                      }
                  });
              });
          }
          else{
              let cborlen = Buffer.from([0x83]);
              let totaldata;
              msg.key = msg.key.toString();
              const key = (msg.key as string).split(':');
              const cborkey = cbor.encode(key[0]);
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
                  totaldata = Buffer.concat([cborlen, cborkey, cbor.encode(key[1]), (msg.value as Buffer)]);
                  const isPresent = localMempool.rejectTx(key[1]);
                  if(isPresent){
                      return;
                  }
                  // publish this event to the client
              }
              
              Object.values(connections).forEach((connection:WebSocket & {id:number}) => {
                  
                  connection.send(totaldata, (err) => {
                      if(err){
                          console.log("error sending message to client");
                          delete connections[connection.id]; 
                      }
                  });
              });
            }
        });
      }
    );
  }
);
