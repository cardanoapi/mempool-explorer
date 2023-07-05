
export class Mempool{
  state: Map<string, string >;
  constructor(){
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