"use client";

import {Navbar} from "@app/components/navbar";
import TransactionsContainer from "@app/components/transactions";
import {Client} from '@stomp/stompjs';
import {useEffect} from "react";
import {io} from "socket.io-client";

export default function Home() {

    // const [client, setClient] = useState(new Client());

    useEffect(() => {
        // connectToSocket();
        socketInitializer();
    }, [])

    const connectToSocket = async () => {
        // await fetch("/api/socket");
        const client = new Client();
        client.configure({
            brokerURL: "ws://localhost:8080/api/socket",
            onConnect: () => {
                console.log("connected!")
                client.subscribe("newIncomingMessage", message => {
                    console.log("message: ", message)
                })
            },
            debug: (str) => {
                console.log(new Date(), str);
            }
        })
        client.activate();
    }

    const socketInitializer = async () => {
        await fetch('/api/socket');
        const socket = io()

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.io.on("error", (e) => {
            console.log("error: ",e)
        })

    }

    // const connectToSocket = async () => {
    //     // await fetch('ws://localhost:8080/api/socket');
    //     const socket = io()
    //
    //     socket.on('connect', () => {
    //         console.log('connected')
    //     })
    // }

    return (
        <main className={"p-4 bg-[#f2f2f2] min-h-screen"}>
            <Navbar/>
            <TransactionsContainer/>
        </main>
    );
}
