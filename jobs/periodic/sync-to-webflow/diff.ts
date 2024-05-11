import { WebflowMetadata } from './webflow-adapter';
import { isEqual } from 'lodash';

export type DBIdMap<T> = { [key: number]: T };

export function mapToDBId<T extends WebflowMetadata>(data: T[]): DBIdMap<T> {
    const res = {};
    for (const row of data) {
        res[row.fieldData.slug] = row;
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

        const left = { ...leftMap[dbId].fieldData, hash: '' };
        // if (leftMap[dbId].fieldData.hash != rightMap[dbId].fieldData.hash) {
        if (!isEqual(left, { ...rightMap[dbId].fieldData, hash: '' })) {
            console.log(JSON.stringify({ ...leftMap[dbId].fieldData, hash: '' }, null, 2));
            console.log(JSON.stringify({ ...rightMap[dbId].fieldData, hash: '' }, null, 2));
            // We have to save the old item id, so that it can be used for the update operation
            rightMap[dbId].id = leftMap[dbId].id;
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
