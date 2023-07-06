// const shutdown = require('./lib/gracefulShutdown')
import logger from "./logger";
import * as cbor from 'cbor';

export type RetryAction=(callback?:RetryAction)=>void
type BrustAction<T>=(T,RetryAction)=>void


type ThrottleEvent="message" | "error" | "hungry" | "satiated" | "complete" | "processed" 
export class Throttle<T>{
    dataArray :Array<T>=[]
    inFlight =0
    concurrency: number
    
    paused= false
    hungry=true
    satiated=false
    handlers={
        "message": (message:T,callback:BrustAction<T>)=> undefined,
        "error": ()=>{},
        "hungry": ()=>{},
        "complete" :()=>{},
        "satiated" :()=>{},
        "processed": (message:T) =>{},
    }
    private setSetiated(){
            logger.degug("[Throttle] satiated with " + this.dataArray.length + " messages")
            this.handlers.satiated()
            this.satiated=true
            this.hungry=false
    }
    private _checkSatiated(){
        if(this.dataArray.length>=(this.concurrency*4) && !this.satiated){
            this.setSetiated()
        }
    }
    private _checkHungry(){
        console.log(this.dataArray.length);
        if(this.dataArray.length < (this.concurrency*2) && !this.hungry){
            logger.degug("[Throttle] hungry at " + this.dataArray.length + " messages")
            this.handlers.hungry()
            this.satiated=false
            this.hungry=true
        }
    }

    constructor(concurrency:number,paused=false){
        this.concurrency=concurrency
        this.paused=paused
    }
    private executeTasks(){
        if(this.paused){
            return
        }
        while(this.inFlight <this.concurrency && this.dataArray.length > 0){
            console.log(this.dataArray);
                const message = this.dataArray.shift();
                this.handlers.message(message,(data, err)=>{
                    this.inFlight --;
                    if(err){
                        logger.warn("[Throtte]  Unexpected error reported by worker");
                        
                    }else{
                        this.handlers.processed(message)
                        this.executeTasks()
                        this._checkHungry()
                    }

                })
                
        }
            
    }

    addMessage(message:T){
        this.addMessages([message])
    }
    addMessages(messages:[T]){
        this.dataArray.push(...messages)
        this.executeTasks()
        this._checkSatiated()

    }

    pause(){
        this.paused=true
        if(!this.satiated){
            this.setSetiated()
        }
    }
    
    on(event: ThrottleEvent, callback){
            this.handlers[event]=callback
    }
    start(){
        this.paused=false
        this._checkHungry();
        this.executeTasks()
    }

}
