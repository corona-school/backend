import { getLogger } from '../../utils/logging';
import { join } from 'path';

const logger = getLogger();
const WEBFLOW_MAX_PUBLISH_ITEMS = 100;

export interface WebflowMetadata {
    _id?: string;
    _archived?: boolean;
    _draft?: boolean;
    name?: string;
    // The slug is a unique value that should never be changed because it cannot be reused.
    // Said that we are using it to store the hash, which should always match the actual data stored in the item.
    slug?: string;
    databaseid?: string; // We are using a string to be safe for any case.
}

export const emptyMetadata: WebflowMetadata = {
    _id: '',
    _archived: false,
    _draft: false,
    slug: '',
};

// Helper functions to communicate to the Webflow API
// https://developers.webflow.com/reference/get-authorized-user

export async function getCollectionItems<T extends WebflowMetadata>(collectionID: string, factory: (data: any) => T): Promise<T[]> {
    // TODO: implement pagination
    const data = await request({ path: `collections/${collectionID}/items`, method: 'GET' });
    if (!data.items) {
        throw new Error('Response did not include any items');
    }
    return data.items.map(factory);
}

export async function createNewItem<T extends WebflowMetadata>(collectionID: string, data: T): Promise<string> {
    // We have to remove the _id field for new items, otherwise we would try to set an empty id, which is not permitted.
    const body = { fields: structuredClone(data) as WebflowMetadata };
    delete body.fields._id;

    const response = await request({ path: `collections/${collectionID}/items`, method: 'POST', data: body });
    return response._id;
}

export async function deleteItems(collectionId: string, itemIds: string[]) {
    const body = { itemIds: itemIds };
    // ?live=true says that they should be automatically unpublished from the website
    await request({ path: `collections/${collectionId}/items?live=true`, method: 'DELETE', data: body });
}

export function publishItems(collectionId: string, itemIds: string[]) {
    // TODO: fetch all items, filter for not published, publish
    const requests = [];
    for (let i = 0; i < itemIds.length; i += WEBFLOW_MAX_PUBLISH_ITEMS) {
        const chunk = itemIds.slice(i, i + WEBFLOW_MAX_PUBLISH_ITEMS);
        requests.push(request({ path: `collections/${collectionId}/items/publish`, method: 'PUT', data: { itemIds: chunk } }));
    }
    return Promise.all(requests);
}

interface Request {
    path: string;
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    data?: any;
}

async function request(req: Request): Promise<any> {
    const url = join(process.env.WEBFLOW_API_BASE_URL, req.path);
    const token = process.env.WEBFLOW_API_KEY;

    const options: RequestInit = {
        method: req.method,
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${token}`,
        },
    };

    if (req.data) {
        options.body = JSON.stringify(req.data);
        options.headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, options);
    if (res.status < 100 || res.status >= 300) {
        const data = await res.json();
        logger.error('webflow api request failed', { status: res.status, data });
        throw new Error(`API returned invalid status ${res.status}: `);
    }
    return res.json();
}
