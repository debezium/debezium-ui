
import { useState } from 'react';

export type PostWithReturnApiResult<T> = {
    response: T | null;
    isLoading: boolean;
    error: Error | null;
    postWithReturn: (url: string | null, api: any, serviceRef: any, postData: any, dynamicParam?: string) => Promise<void>;
};

function usePostWithReturnApi<T>(): PostWithReturnApiResult<T> {
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const postWithReturn = async (url: string | null, api: any, serviceRef: any,postData: any, dynamicParam?: string) => {
        setIsLoading(true);
        try {
            const apiCall = api.bind(serviceRef);
                const response = await apiCall(url, postData, dynamicParam?dynamicParam:null);
            setResponse(response);
        } catch (error) {
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return { response, error, isLoading, postWithReturn };
};

export default usePostWithReturnApi;
