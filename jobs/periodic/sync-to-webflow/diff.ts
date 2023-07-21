import { emptyMetadata, WebflowMetadata } from './webflow-adapter';
import { sha1 } from 'object-hash';

export function hash<T extends WebflowMetadata>(data: T): string {
    const raw = { ...data, ...emptyMetadata };
    return sha1(raw);
}

export type DBIdMap<T> = { [key: number]: T };

export function mapToDBId<T extends WebflowMetadata>(data: T[]): DBIdMap<T> {
    const res = {};
    for (const row of data) {
        res[row.slug] = row;
    }
    return res;
}

export function diff<T extends WebflowMetadata>(left: T[], right: T[]): { new: T[]; outdated: T[]; changed: T[] } {
    const leftMap = mapToDBId(left);
    const rightMap = mapToDBId(right);

    const newEntries: T[] = [];
    const outdatedEntries: T[] = [];
    const changedEntries: T[] = [];

    for (const dbId in leftMap) {
        if (!rightMap[dbId]) {
            outdatedEntries.push(leftMap[dbId]);
            continue;
        }
        if (leftMap[dbId].hash != rightMap[dbId].hash) {
            // We have to save the old item id, so that it can be used for the update operation
            rightMap[dbId]._id = leftMap[dbId]._id;
            changedEntries.push(rightMap[dbId]);
        }
    }

    for (const dbId in rightMap) {
        if (!leftMap[dbId]) {
            newEntries.push(rightMap[dbId]);
        }
    }

    return { new: newEntries, outdated: outdatedEntries, changed: changedEntries };
}
