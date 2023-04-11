import { getLogger } from '../../../common/logger/logger';
import { join } from 'path';
import moment from 'moment';

const logger = getLogger('WebflowApiAdapter');
const WEBFLOW_MAX_PUBLISH_ITEMS = 100;

export interface WebflowMetadata {
    _id?: string;
    _archived?: boolean;
    _draft?: boolean;
    name?: string;
    // The slug is a unique value that should never be changed because it cannot be reused.
    // Said that we are using it to store the database id, which should always match the actual data stored in the item.
    slug?: string;
    hash?: string;
    'updated-on'?: string;
    'published-on'?: string;
}

export const emptyMetadata: WebflowMetadata = {
    _id: '',
    _archived: false,
    _draft: false,
    slug: '',
    hash: '',
    'updated-on': '',
    'published-on': '',
};

function basicMetaFactory(data: any): WebflowMetadata {
    return data;
}

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
    await request({ path: `collections/${collectionId}/items?live=false`, method: 'DELETE', data: body });
}

export async function patchItem<T extends WebflowMetadata>(collectionId: string, item: T) {
    const itemId = item._id;
    const body = { fields: structuredClone(item) as WebflowMetadata };
    delete body.fields._id;
    await request({ path: `collections/${collectionId}/items/${itemId}`, method: 'PATCH', data: body });
}

export async function publishItems(collectionId: string) {
    const items = await getCollectionItems(collectionId, basicMetaFactory);
    const itemIds = items
        .filter((item) => {
            const updated = moment(item['updated-on']);
            const published = moment(item['published-on']);
            // Published on is null if the item is new. If there was an update updated-by is after published-by.
            return item['published-on'] === null || updated.isAfter(published);
        })
        .map((item) => item._id);

    const requests = [];
    for (let i = 0; i < itemIds.length; i += WEBFLOW_MAX_PUBLISH_ITEMS) {
        const chunk = itemIds.slice(i, i + WEBFLOW_MAX_PUBLISH_ITEMS);
        requests.push(request({ path: `collections/${collectionId}/items/publish`, method: 'PUT', data: { itemIds: chunk } }));
    }
    await Promise.all(requests);
    return itemIds;
}

interface Request {
    path: string;
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
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
    if (res.status < 200 || res.status >= 300) {
        const data = await res.json();
        logger.error('webflow api request failed', { status: res.status, data });
        throw new Error(`API returned invalid status ${res.status}: `);
    }
    return res.json();
}
