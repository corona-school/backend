import { emptyMetadata, WebflowMetadata } from './webflow-adapter';
import { sha1 } from 'object-hash';

export function hash<T extends WebflowMetadata>(data: T): string {
    const raw = { ...data, ...emptyMetadata };
    return sha1(raw);
}

function mapToDBId<T extends WebflowMetadata>(data: T[]): { [key: number]: T } {
    const res = {};
    for (const row of data) {
        res[row.slug] = row;
    }
    return res;
}

export function diff<T extends WebflowMetadata>(left: T[], right: T[]): { new: T[]; outdated: T[] } {
    const leftMap = mapToDBId(left);
    const rightMap = mapToDBId(right);

    const newEntries: T[] = [];
    const outdatedEntries: T[] = [];

    for (const dbId in leftMap) {
        if (!rightMap[dbId]) {
            outdatedEntries.push(leftMap[dbId]);
            continue;
        }
        if (leftMap[dbId].hash != rightMap[dbId].hash) {
            // This could also be an update operation, but at the end it's the same amount of API operations, but much more code to maintain.
            // Nevertheless, we should monitor the website and update the behavior if we see side-effects.
            outdatedEntries.push(leftMap[dbId]);
            newEntries.push(rightMap[dbId]);
        }
    }

    for (const dbId in rightMap) {
        if (!leftMap[dbId]) {
            newEntries.push(rightMap[dbId]);
        }
    }

    return { new: newEntries, outdated: outdatedEntries };
}

export type DBIdMap = { [key: number]: string };

export function mapDBIdToId(items: WebflowMetadata[]): DBIdMap {
    const result: DBIdMap = {};
    for (const item of items) {
        result[item.slug] = item._id;
    }
    return result;
}
