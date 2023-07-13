"use client";

import {Navbar} from "@app/components/navbar";
import TransactionsContainer from "@app/components/transactions";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
    
    return (
        <main className={'flex flex-1 flex-col bg-[#f2f2f2] min-h-screen max-h-screen'}>
            <ToastContainer />
            <Navbar />
            <TransactionsContainer />
        </main>
    );
}
