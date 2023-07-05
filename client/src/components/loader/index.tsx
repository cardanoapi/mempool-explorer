import React from "react";

const Loader = () => {
    return (
        <div className={"flex flex-col justify-center items-center"}>
            <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
            </div>
            <div>Loading data...</div>
        </div>
    );
};

export default Loader;