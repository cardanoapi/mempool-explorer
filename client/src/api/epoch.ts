

export const getEpochDetails = async () => {
    const response = await fetch('/api/v1/epoch/current');
    return await response.json();
};
