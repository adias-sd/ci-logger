export interface FileObject {
    filename: string;
    size: number;
    modifiedTime: number;
    type: string;
    id: string;
}

export interface FileProps {
    params: {
        fileId: string;
    };
}

export interface Chunk {
    "contents": Array<string>,
    "startPosition": number,
    "endPosition": number, 
    "eof": boolean,
    "filename": string
}