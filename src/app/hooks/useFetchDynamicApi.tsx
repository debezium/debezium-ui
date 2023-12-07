import { useEffect, useState } from "react";
import { FetchApiResult } from "./useFetchApi";

function useFetchDynamicApi<T>(
  url: string | null,
  api: any,
  serviceRef: any,
  dynamicData: any,
  pollingInterval?: number
): FetchApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const apiCall = api.bind(serviceRef);
        const response = await apiCall(url, dynamicData);

        setData(response);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(error as Error);

        console.error("Error fetching data:", error);
      }
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

export default useFetchDynamicApi;
