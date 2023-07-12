'use client';

import {useEffect, useState} from 'react';

import {Transaction} from '@emurgo/cardano-serialization-lib-asmjs';
import {Decoder, Encoder, addExtension, decode} from 'cbor-x';

import {SocketResponseMock} from '@app/assets/mock-data/mock-data';
import BlockDetails from '@app/components/transactions/block-details';
import {SocketEventResponseType} from '@app/types/transaction-details-response/socket-response-type';

import MempoolTransactionsList from './transaction-details';
import TransactionEventList from './transaction-hash-list';

export default function TransactionsContainer() {
    const [transactionHashes, setTransactionHashes] = useState<Array<SocketEventResponseType>>([]);

    const timeout = setTimeout(() => {
        setTransactionHashes([SocketResponseMock[transactionHashes.length], ...transactionHashes]);
    }, 5000);

    if (transactionHashes.length === SocketResponseMock.length) {
        clearTimeout(timeout);
    }

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws');

        // Listen for messages
        addExtension({
            Class: Transaction,
            tag: 24, // register our own extension code (a tag code)
            encode(instance: Transaction, encode) {
                // define how your custom class should be encoded
                return encode(instance.to_bytes()); // return a buffer
            },
            decode(data: Buffer) {
                // define how your custom class should be decoded
                console.debug('Decoding transaction', data.toString('hex'));
                let instance = Transaction.from_bytes(data);
                return instance; // decoded value from buffer
            }
        });

        const decoder = new Decoder();
        const enc = new Encoder();
        socket.addEventListener('message', async (event: MessageEvent) => {
            const data = decoder.decode(Buffer.from(await event.data.arrayBuffer()));
            console.log('data from socket: ', data);
            switch (data[0]) {
                case 'add':
                    const txcbor = data[2][1];
                    console.log('data', txcbor.to_js_value());
                case 'remove':
                case 'reject':
                default:
            }
            console.log('Message from server ');
        });
    }, []);

    return (
        <div className="overflow-y-auto">
            <div className="flex calc-h-68 px-5 flex-1">
                <div className={"overflow-y-scroll"}>
                    <TransactionEventList transactions={transactionHashes}/>
                </div>
                <div className=" flex gap-2 flex-col flex-1">
                    <MempoolTransactionsList event={transactionHashes[0]}/>
                    <BlockDetails/>
                </div>
            </div>
        </div>
    );
}
