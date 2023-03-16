import { emptyMetadata, WebflowMetadata } from './webflow-adapter';
import { sha1 } from 'object-hash';

export function hash<T extends WebflowMetadata>(data: T): string {
    const raw = { ...data, ...emptyMetadata };
    return sha1(raw);
}

function mapToDBId<T extends WebflowMetadata>(data: T[]): { [key: number]: T } {
    const res = {};
    for (const row of data) {
        res[row.databaseId] = row;
    }
    return res;
}

export function diff<T extends WebflowMetadata>(left: T[], right: T[]): { new: T[]; outdated: T[]; update: T[] } {
    const leftMap = mapToDBId(left);
    const rightMap = mapToDBId(right);

    const newEntries: T[] = [];
    const outdatedEntries: T[] = [];
    const entriesToUpdate: T[] = [];

    for (const dbId in leftMap) {
        if (!rightMap[dbId]) {
            outdatedEntries.push(leftMap[dbId]);
            continue;
        }
        if (leftMap[dbId].hash != rightMap[dbId].hash) {
            entriesToUpdate.push(leftMap[dbId]);
        }
    }

    for (const dbId in rightMap) {
        if (!leftMap[dbId]) {
            newEntries.push(rightMap[dbId]);
        }
    }

    return { new: newEntries, outdated: outdatedEntries, update: entriesToUpdate };
}
