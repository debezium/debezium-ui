/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

export type FetchApiResult<T> = {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
};



function useFetchApi<T>(url: string | null, api: any, serviceRef: any, pollingInterval?: number): FetchApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const apiCall = api.bind(serviceRef);
                const response = await apiCall(url);
                setData(response);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setError(error as Error);
                console.log(error);
            } 
            // finally {
            //     setIsLoading(false);
            // }
        };

        if (url) {
            fetchData();
        }

        if (pollingInterval) {
            const intervalId = setInterval(() => {
                if (!ignore) {
                    fetchData();
                }
            }, pollingInterval);

            return () => {
                clearInterval(intervalId);
                ignore = true;
            };
        }

        return () => {
            ignore = true;
        };
    }, [api, serviceRef, url, pollingInterval]);

    return { data, isLoading, error };
}

export default useFetchApi;
