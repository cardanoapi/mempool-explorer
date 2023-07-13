import Link from 'next/link';

import SearchBar from '@app/components/navbar/search-bar';

export function Navbar() {
    return (
        <nav className="flex flex-col h-16 md:flex-row md:items-center md:justify-between px-6 items-center">
            <Link href="/">
                <div className="text-lg font-bold cursor-pointer mb-4 md:mb-0 !text-cardano">Mempool Explorer</div>
            </Link>
            <SearchBar />
        </nav>
    );
}
