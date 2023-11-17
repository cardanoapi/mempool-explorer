export const ErrorPage = (props: any) => {
    const error = props.errObj;
    return (
        <div className={'flex flex-col justify-center items-center'}>
            <p className={'text-3xl font-bold '}>{error.message}</p>
            <h1 className={'text-lg'}>Error {error.status}</h1>
        </div>
    );
};

export const checkForErrorResponse = async (response: any) => {
    const header = response.headers.get('content-type');
    if (header === 'application/json') {
        const errorObj = await response.json();
        const error: any = new Error(errorObj.error);
        error.code = errorObj.status ? errorObj.status : 500;
        throw error;
    }
    return;
};
