"use client";

import SearchBarIcon from "@app/assets/svgs/search-bar-icon";
import {useRouter} from "next/navigation";

export default function SearchBar() {

    const router = useRouter();

    const handleKeyPress = (event: any) => {
        if (event.key === "Enter") {
            router.push(`/${event.target.value}`)
        }
    };

    return (
        <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1">
            <input
                type="text"
                placeholder="Search"
                className="outline-none w-fullR bg-transparent"
                onKeyDown={handleKeyPress}
            />
            <SearchBarIcon/>
        </div>
    )
}