// import { Transaction, hash_transaction } from "@emurgo/cardano-serialization-lib-asmjs";
import {Transaction} from './cborparser';
import { Decoder, Encoder, addExtension } from "cbor-x";
import { TransactionParser, TransactionInput, TransactionOutput, Value, Mint, ITransaction } from "./parser";

type EventType = "mint" | "rollback" | "addTx" | "removeTx" | "rejectTx" | "disconnected" | "connected";

export interface AddTxMessage {
  mempoolTxCount: number;
  mempoolSize: number;
  hash: string;
  tx: Transaction;
}

export interface RejectTxMessage{
  mempoolTxCount: number;
  mempoolSize: number;
  hash: string;
  tx: Transaction;
}

export interface RemoveTxMessage{
  mempoolTxCount:number;
  mempoolSize:number;
  txHashes:string[];
}

export interface MintMessage {
  slotNumber:number;
  headerHash:string;
  txHashes:string[];
}

export interface RollbackMessage {
  slotNumber:number;
  headerHash:string;
}

interface CardanoWebSocket{
  wsUrl: string;
  ws: WebSocket;
  on(event:"mint", callback:(mintMessage: MintMessage)=>void):void
  on(event:"rollback", callback:(rollabckMessage: RollbackMessage)=>void):void;
  on(event: "addTx", callback:(addMessage: AddTxMessage)=>void):void;
  on(event:"removeTx", callback:(removeMessage: RemoveTxMessage)=>void):void;
  on(event:"rejectTx", callback:(rejectMessage: RejectTxMessage)=>void):void;
  on(event:"disconnected", callback:()=>void):void;
  on(event:"connected", callback:()=>void):void;
  unsubscribe(event:EventType):void;
  close():void;
  reconnect():void;
}

addExtension({
    Class: Transaction,
    tag: 24, // register our own extension code (a tag code)
    encode(instance:Transaction, encode) {
        return instance.transaction.inputs;
    },
    decode(data:Buffer) {
        // console.debug("Decoding transaction",data.toString('hex'))
        let instance = new Transaction(data);
        return instance;
    }
});

export default class CardanoWebSocketImpl implements CardanoWebSocket{
  wsUrl: string;
  ws: WebSocket;
  consumers:Record<string, CallableFunction>;
  static ins:CardanoWebSocketImpl|null = null;
  private constructor(wsUrl:string){
    this.wsUrl = wsUrl;
    this.ws = new WebSocket(wsUrl);
    this.listenToWs();
    this.consumers = {}
  }

  public static createConnection(wsUrl: string):CardanoWebSocket{
    // if(CardanoWebSocketImpl.ins){
    //   return CardanoWebSocketImpl.ins
    // }
    return CardanoWebSocketImpl.ins =new CardanoWebSocketImpl(wsUrl);
  }
  public on(event:EventType,callback:CallableFunction):void{
    this.consumers[event]=callback;
  }
  public unsubscribe(event:EventType):void{
    delete this.consumers[event];
  }
  public close(){
    this.ws.close();
  };
  public reconnect(){
    this.ws = new WebSocket(this.wsUrl);
  };
  private listenToWs(){
    const decoder = new Decoder();
    const enc = new Encoder();
    this.ws.addEventListener("message", async (event:MessageEvent) => {
      try{
        // console.log(Buffer.from(await event.data.arrayBuffer()).toString('hex'));
        const data = decoder.decode(Buffer.from(await event.data.arrayBuffer()));
        switch(data[0]){
            case "add":
              const tx:Transaction = data[2][1];
              const txCount = data[2][0][0];
              const mempoolSize = data[2][0][1];
              const hash = Buffer.from(data[1]).toString('hex');
              this.consumers.addTx({mempoolTxCount:txCount, mempoolSize:mempoolSize, hash:data[1], tx:tx});
              break;

            case "remove":
              const txHashes = data[1][1];
              const removehashes = txHashes.map((txHash:Uint8Array) => Buffer.from(txHash).toString('hex'));
              const txCountt = data[1][0][0];
              const txMempoolSize = data[1][0][1];
              this.consumers.removeTx({txHashes:removehashes, mempoolTxCount:txCountt, mempoolSize:txMempoolSize});
              break;

            case "reject":
              // console.log("reject");
              const _tx:Transaction = data[2][1];
              const _txCount = data[2][0][0];
              const _mempoolSize = data[2][0][1];
              const txhash = Buffer.from(data[1]).toString('hex');
              this.consumers.rejectTx({mempoolTxCount:_txCount, mempoolSize:_mempoolSize, hash:data[1], tx:_tx});
              break;

            case "rollback":
              // console.log("rollback");
              // console.log(data);
              const slotNumber = data[1];
              const headerHash = data[2];
              this.consumers.rollback({slotNumber, headerHash} as RollbackMessage);
              break;

            case "mint":
              console.log("mint");
              console.log(data);
              const slotNumberMint:number = data[1];
              const headerHashMint = Buffer.from(data[2]).toString('hex');
              const txHashesMint = data[3];
              const hashes:string[] = txHashesMint.map((txHash:Uint8Array)=> Buffer.from(txHash).toString('hex'));
              this.consumers.mint({slotNumber:slotNumberMint, headerHash:headerHashMint, txHashes:hashes} as MintMessage);
              break;

            default:
              break;
        }
      }
      catch(e){
        console.error("Decode Error: ", e);
      }
    });
  }
}