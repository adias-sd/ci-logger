import axios from 'axios';

import apis from '~/utils/apis';

const baseURL = apis.files;

export async function getFiles(folder: string) {
    const options ={
        baseURL,
        url: `/files/${folder}`,
        method: 'GET',
    }
    const response = await axios(options);
    return response.data;
}

export async function getFile(file: string, position: number = 0, size: number = 100, setChunks: any, setPosition: any) {
    const options ={
        baseURL,
        url: `/file/${file}`,
        method: 'GET',
        params: {
            position,
            size,
        },
    };
    const response = await axios(options);
    if (setChunks) {
        setChunks(
            (prev: any) => {
                return [response.data, ...prev]
            }
        )
    }
    if (setPosition) {
        setPosition(response.data.endPosition);
    }
    return response.data;
}