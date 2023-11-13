export default function SwaggerLayout({ children }: { readonly children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Mempool Explorer</title>
            </head>
            <body className="!bg-white">{children}</body>
        </html>
    );
}
