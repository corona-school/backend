import { getLogger } from '../../../common/logger/logger';
import moment from 'moment';
import { isWebflowSyncDryRun } from '../../../utils/environment';
import { WebflowClient, Webflow } from 'webflow-api';

const logger = getLogger('WebflowApiAdapter');
const WEBFLOW_MAX_PUBLISH_ITEMS = 100;

const webflowClient = new WebflowClient({ accessToken: process.env.WEBFLOW_API_KEY });
const webflowItemClient = webflowClient.collections.items;

export const emptyMetadata: Webflow.CollectionItem = {
    id: '',
    isArchived: false,
    isDraft: false,
    lastPublished: '',
    lastUpdated: '',
    fieldData: {},
};

function basicMetaFactory(data: any): Webflow.CollectionItem {
    return data;
}

// Helper functions to communicate to the Webflow API
// https://developers.webflow.com/reference/get-authorized-user

export async function getCollectionItems<T extends Webflow.CollectionItem>(collectionID: string, factory: (data: any) => T): Promise<T[]> {
    const items = await webflowItemClient.listItems(collectionID);
    // TODO: implement pagination
    // const data = await request({ path: `v2/collections/${collectionID}/items`, method: 'GET' });
    // if (!data.items) {
    // throw new Error('Response did not include any items');
    // }
    return items.items.map(factory);
    // return data.items.map(factory);
}

export async function createNewItem<T extends Webflow.CollectionItem>(collectionID: string, data: T): Promise<string> {
    const body = structuredClone(data) as Webflow.CollectionItem;
    // delete body.id;

    await webflowItemClient.createItemLive(collectionID, body);
    return body.id;

    // const response = await request({ path: `v2/collections/${collectionID}/items/live`, method: 'POST', data: body });
    // return response.id;
}

export async function deleteItems(collectionId: string, itemIds: string[]) {
    for (const id of itemIds) {
        await webflowItemClient.deleteItemLive(collectionId, id);
        // await request({ path: `v2/collections/${collectionId}/items/${id}`, method: 'DELETE' });
    }
}

export async function patchItem<T extends Webflow.CollectionItem>(collectionId: string, item: T) {
    // await request({ path: `v2/collections/${collectionId}/items/${itemId}/live`, method: 'PATCH', data: { fieldData: item.fieldData } });
    await webflowItemClient.updateItemLive(collectionId, item.id, item);
}

export async function publishItems(collectionId: string) {
    const items = await getCollectionItems(collectionId, basicMetaFactory);
    const itemIds = items
        .filter((item) => {
            const updated = moment(item.lastUpdated);
            const published = moment(item.lastPublished);
            // Published on is null if the item is new. If there was an update updated-by is after published-by.
            return item.lastPublished === null || !item.lastPublished || updated.isAfter(published);
        })
        .map((item) => item.id);

    const requests = [];
    for (let i = 0; i < itemIds.length; i += WEBFLOW_MAX_PUBLISH_ITEMS) {
        const chunk = itemIds.slice(i, i + WEBFLOW_MAX_PUBLISH_ITEMS);
        requests.push(webflowItemClient.publishItem(collectionId, { itemIds: chunk }));
        // requests.push(request({ path: `v2/collections/${collectionId}/items/publish`, method: 'POST', data: { itemIds: chunk } }));
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
    const url = `${process.env.WEBFLOW_API_BASE_URL}/${req.path}`;
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

    if (req.method !== 'GET' && isWebflowSyncDryRun()) {
        logger.info(`Webflow sync dry run`, { url, options: { ...options, headers: { ...options.headers, authorization: '' } } });
        return null;
    }

    const res = await fetch(url, options);
    if (res.status < 200 || res.status >= 300) {
        const data = await res.json();
        logger.error('webflow api request failed', new Error('webflow api request failed'), { status: res.status, data });
        throw new Error(`API returned invalid status ${res.status}: `);
    }
    // If 204 it means there is no content
    if (res.status === 204) {
        return null;
    }
    return res.json();
}
