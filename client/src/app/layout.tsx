import NextTopLoader from 'nextjs-toploader';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '@app/molecules/Navbar';

import './globals.css';
import Script from 'next/script';


export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Mempool Explorer</title>
            </head>
            <body className="!bg-black !text-white">
                <NextTopLoader showSpinner={false} color="#E6E6E6" />
                <Navbar />
                <ToastContainer position="bottom-right" theme="dark" autoClose={3000} newestOnTop closeOnClick pauseOnFocusLoss pauseOnHover limit={8} />
                {children}
            </body>
            {/* <!-- Google tag (gtag.js) --> */}
            <Script
                id="google-analytics-script"
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=G-MG10RWWQ1Y`}
            />

            <Script strategy="lazyOnload"
                id="google-analytics-code"
            >
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-MG10RWWQ1Y', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>
        </html>
    );
}