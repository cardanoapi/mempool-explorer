import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '@app/molecules/Navbar';

import './globals.css';

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Mempool Explorer: Real-Time Transaction Status & Network Insights</title>
                <meta name="description" content="Explore the full Cardano ecosystem with The Mempool. See the real-time status of your transactions, browse network stats, and more." />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Mempool Explorer: Real-Time Transaction Status & Network Insights" />
                <meta property="og:description" content="Explore the full Cardano ecosystem with The Mempool. See the real-time status of your transactions, browse network stats, and more." />
                <meta property="og:image" content="/seo/og-image.png" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://mempool.cardanoapi.io/" />
                <meta property="og:site_name" content="Mempool Explorer" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@cardano" />
                <meta name="twitter:title" content="Mempool Explorer: Real-Time Transaction Status & Network Insights" />
                <meta name="twitter:description" content="Explore the full Cardano ecosystem with The Mempool. See the real-time status of your transactions, browse network stats, and more." />
                <meta name="twitter:image" content="/seo/og-image.png" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="!bg-black !text-white">
                <NextTopLoader showSpinner={false} color="#E6E6E6" />
                <Navbar />
                <ToastContainer position="bottom-right" theme="dark" autoClose={3000} newestOnTop closeOnClick pauseOnFocusLoss pauseOnHover limit={8} />
                {children}
            </body>
            {/* <!-- Google tag (gtag.js) --> */}
            <Script id="google-analytics-script" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=G-MG10RWWQ1Y`} />

            <Script strategy="lazyOnload" id="google-analytics-code">
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
