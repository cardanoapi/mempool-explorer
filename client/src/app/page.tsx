"use client";

import {Navbar} from "@app/components/navbar";
import TransactionsContainer from "@app/components/transactions";
import {Client} from '@stomp/stompjs';
import { useEffect } from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Decoder, addExtension, Encoder, decode} from 'cbor-x';
import { Transaction } from "@emurgo/cardano-serialization-lib-asmjs";


export default function Home() {

    useEffect(()=>{
            const socket = new WebSocket("ws://localhost:8080/ws");
        // socket.addEventListener("open", (event) => {
        //     socket.send("Hello Server!");
        // });

        // Listen for messages
        addExtension({
            Class: Transaction,
            tag: 24, // register our own extension code (a tag code)
            encode(instance:Transaction, encode) {
                // define how your custom class should be encoded
                return encode(instance.to_bytes()); // return a buffer
            },
            decode(data:Buffer) {
                // define how your custom class should be decoded
                console.debug("Decoding transaction",data.toString('hex'))
                let instance = Transaction.from_bytes(data);
                return instance; // decoded value from buffer
            }
        });

        const decoder = new Decoder();
        const enc = new Encoder();
        socket.addEventListener("message", async (event:MessageEvent) => {
            console.log(Buffer.from(await event.data.arrayBuffer()).toString('hex'));
            const data = decoder.decode(Buffer.from(await event.data.arrayBuffer()));
            if(data[0]=="rollback" || data[0]=="mint"){
                console.log("Block received");
                console.log(data);
            }
            switch(data[0]){
                case "add":
                    const txcbor = (data[2][1]);
                    console.log(data[2]);
                    data[2][1].free();
                case "remove":
                case "reject":
                case "rollback":
                default:
            }
            console.log("Message from server ",  );
        });
    }, []);
    

    
    return (
        <main className={"p-4 bg-[#f2f2f2] min-h-screen"}>
            <ToastContainer/>
            <Navbar/>
            <TransactionsContainer/>
        </main>
    );
}
