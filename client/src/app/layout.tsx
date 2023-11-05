import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Mempool Explorer</title>
            </head>
            <body className="!bg-black !text-white">{children}</body>
        </html>
    );
}
