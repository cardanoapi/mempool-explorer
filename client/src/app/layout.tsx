import NextTopLoader from 'nextjs-toploader';

import Navbar from '@app/molecules/Navbar';

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Mempool Explorer</title>
            </head>
            <body className="!bg-black !text-white">
                <NextTopLoader showSpinner={false} color="#E6E6E6" />
                <Navbar />

                {children}
            </body>
        </html>
    );
}
