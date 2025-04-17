import { useState, useEffect } from 'react'; 
import type { DependencyList } from 'react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

import apis from '~/utils/apis';

export function useRestRequest(api: string, options: AxiosRequestConfig, initResult: any, deps: DependencyList = []){
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(initResult);
    const [error, setError] = useState({error: 0, details: ''});

    if (!(api in apis)) {
        throw new Error(`API ${api} not found`);
    }

    const baseURL = apis[api];

    const axiosOptions = {
        ...options,
        baseURL,
    }

    async function request() {
        try {
            setError({error: 0, details: ''});
            setLoading(true);
            const resp = await axios(axiosOptions);
            setResult(resp.data);
        } catch(e: any) {
            console.log(e);
            setError({error: e.status || -1, details: `${e}`});
        } finally {
            setLoading(false);
        }
    }

    useEffect(
        () => {   
            request();
        },
        deps,
    );
    return {result, loading, error};
}
