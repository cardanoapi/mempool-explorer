import SearchBar from "@app/components/navbar/search-bar";

export function Navbar() {
    return (
        <nav className="flex flex-col !p-0 md:flex-row md:items-center md:justify-between md:px-6 md:py-3">
            <div className="text-lg font-bold mb-4 md:mb-0 !text-cardano">Mempool Explorer</div>
            <SearchBar/>
        </nav>
    )
}