import * as cbor from 'cbor';
export class EventType{

  static from_add(key, value){
    return new AddTx(key, value);
  }

  static from_remove (key,value){
    return new RemoveTx(value);
  }
}

export class AddTx extends EventType{
  txhash:string;
  txbody:string;
  constructor(key:string, value){
    super();
    this.txhash  = key.split(':')[1];
    this.txbody = cbor.decodeFirstSync(value)[1];
  }
}

export class RemoveTx extends EventType{
  txhashList:string[];
  constructor(value){
    super();
    this.txhashList = cbor.decodeFirstSync(value)[1]; 
  }
}
