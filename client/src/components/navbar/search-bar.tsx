import SearchBarIcon from "@app/assets/svgs/search-bar-icon";

export default function SearchBar() {
    return (
        <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1">
            <input
                type="text"
                placeholder="Search"
                className="outline-none w-fullR bg-transparent"
            />
        </div>
    )
}