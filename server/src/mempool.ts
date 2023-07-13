
export class Mempool{
  state: Map<string, string >;
  array : string[];
  constructor(){
    this.state = new Map<string, string>();
    this.array = [];
  }

  addTx(txhash:string, txbody:string){
    if(this.state.size<=20){
      this.state.set(txhash, txbody);
      this.array.push(txhash);
    }
    else{
      this.state.delete(this.array[0]);
      this.state.set(txhash, txbody);
      this.array.shift();
      this.array.push(txhash);
    }
  }
  removeTx(txhash:string[]){
    txhash.forEach((tx)=>{
      this.state.delete(tx);
    });
    this.array = this.array.filter(elem => !txhash.includes(elem))
  }
  public rejectTx(txhash:string):boolean{
    if(this.state.get(txhash)){
      return true;
    }
    else{
      return false;
    }
  }
}