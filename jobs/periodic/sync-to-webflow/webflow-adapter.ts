import { join } from 'path';

export interface WebflowMetadata {
    _id: string;
    _archived: boolean;
    hash: string;
    databaseId?: number;
}

export const emptyMetadata: WebflowMetadata = {
    _id: '',
    _archived: false,
    hash: '',
};

export async function getCollectionItems<T>(collectionID: string, factory: (data: any) => T): Promise<T[]> {
    const data = await request({ path: `collections/${collectionID}/items`, method: 'GET' });
    return data.map(factory);
}

interface Request {
    path: string;
    method: 'GET';
}

async function request(req: Request): Promise<any[]> {
    const url = join(process.env.WEBFLOW_API_BASE_URL, req.path);
    const token = process.env.WEBFLOW_API_KEY;

    const res = await fetch(url, {
        method: req.method,
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
    const json = await res.json();
    return json.items || [];
}
