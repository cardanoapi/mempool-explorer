import SearchBar from "@app/components/navbar/search-bar";

export function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-3">
            <div className="text-lg font-bold !text-cardano">Mempool Explorer</div>
            <SearchBar/>
        </nav>
    )
}