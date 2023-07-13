"use client";

import {Navbar} from "@app/components/navbar";
import TransactionsContainer from "@app/components/transactions";
import {Client} from '@stomp/stompjs';
import { useEffect } from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Decoder, addExtension, Encoder, decode} from 'cbor-x';
import { Transaction } from "@emurgo/cardano-serialization-lib-asmjs";
import CardanoWebSocketImpl, { AddTxMessage, MintMessage, RemoveTxMessage } from "@app/lib/websocket";

export default function Home() {

    useEffect(()=>{
            const sock = CardanoWebSocketImpl.createConnection("ws://localhost:8080/ws");
            sock.on("mint", (msg: MintMessage)=>{
                console.log(msg.slotNumber, msg.headerHash, msg.txHashes);
            });
            sock.on("addTx", (msg:AddTxMessage) =>{
                console.log(msg.hash, msg.tx.transaction.inputs, msg.tx.transaction.outputs, msg.tx.transaction.isMint, msg.tx.transaction.mintTokens, msg.mempoolSize, msg.mempoolTxCount  );
            });
            sock.on("removeTx", (msg:RemoveTxMessage) =>{
                console.log(msg.mempoolSize, msg.mempoolTxCount, msg.txHashes);
            });
    }, []);
    

    
    return (
        <main className={'flex flex-1 flex-col bg-[#f2f2f2] min-h-screen max-h-screen'}>
            <ToastContainer />
            <Navbar />
            <TransactionsContainer />
        </main>
    );
}
