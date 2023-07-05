import React, {useState} from 'react';

const useLoader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState({
        message: "",
        status: undefined,
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