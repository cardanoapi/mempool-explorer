"use client";

import {Navbar} from "@app/components/navbar";
import TransactionsContainer from "@app/components/transactions";
import {Client} from '@stomp/stompjs';

export default function Home() {

    // const [client, setClient] = useState(new Client());

    // useEffect(() => {
    //     connectToSocket();
    // }, [])

    const connectToSocket = async () => {
        await fetch("/api/socket");
        const client = new Client();
        client.configure({
            brokerURL: "ws://localhost:3001/api/socket",
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

    return (
        <main className={"p-4 bg-[#f2f2f2] min-h-screen"}>
            <Navbar/>
            <TransactionsContainer/>
        </main>
    );
}
