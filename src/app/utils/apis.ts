/**
 * Max retries for re-fetching the api call in case of error
 */
const MAX_RETRIES: number = 1;

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Wrapper function to call the underline api call repetitively upto MAX_RETRIES limit in case of error
 * @param api function fetching the api
 * @param serviceRef reference of service type on which to call the api function
 * @param postParam param for post API call of type Array containing element in same order as need to passed in funcion
 * @param retries no. of retries
 */
export function fetch_retry(
    api: any,
    serviceRef: any,
    postParam?: any,
    retries: number = 1
  ): Promise<any> {
    const apicall = api.bind(serviceRef);
    // For Get method
    if (postParam === undefined) {
      return apicall().catch((err: any) => {
        if (retries >= MAX_RETRIES) {
          throw err;
        }
        return fetch_retry(api, serviceRef, ++retries);
      });
    }
    // For Post method
    else {
      return apicall(...postParam).catch((err: any) => {
        if (retries >= MAX_RETRIES) {
          throw err;
        }
        return fetch_retry(api, serviceRef, postParam, ++retries);
      });
    }
  }