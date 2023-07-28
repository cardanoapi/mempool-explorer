import React, {useState} from 'react';
import {ErrorType} from "@app/components/transaction-hash/transaction-input-output";

const useLoader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ErrorType>({
        message: "",
        status: -1,
    });

    const showLoader = () => {
        setIsLoading(true);
    };

    const hideLoader = () => {
        setIsLoading(false);
    };

    return {showLoader, hideLoader, isLoading, error, setError};
};

export default useLoader;