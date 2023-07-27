import {Navbar} from "@app/components/navbar";
import TransactionsContainer from "@app/components/transactions";


export default function Home() {
    return (
        <main className={'flex flex-1 flex-col bg-[#f2f2f2] min-h-screen max-h-screen'}>
            <Navbar />
            <TransactionsContainer ws={process.env.WS_URL?? "ws://localhost:8080/ws"} />
        </main>
    );
}