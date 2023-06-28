import Image from 'next/image';
import {Navbar} from "@app/components/navbar";
import TransactionsContainer from "@app/components/transactions";

export default function Home() {
    return (
        <main className={"p-4 bg-[#f2f2f2] min-h-screen"}>
            <Navbar/>
            <TransactionsContainer/>
        </main>
    );
}
