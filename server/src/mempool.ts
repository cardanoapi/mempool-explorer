
export class Mempool{
  state: Map<string, string >;
  constructor(){
    this.state = new Map<string, string>();
  }

  addTx(txhash:string, txbody:string){
    this.state.set(txhash, txbody);
  }
  removeTx(txhash:string[]){
    txhash.forEach((tx)=>{
      this.state.delete(tx);
    });
  }
}