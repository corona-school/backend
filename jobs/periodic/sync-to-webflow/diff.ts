import { Webflow } from 'webflow-api';
import { isEqual } from 'lodash';
import { Logger } from '../../../common/logger/logger';

export type DBIdMap<T> = { [key: number]: T };

export function mapToDBId<T extends Webflow.CollectionItem>(data: T[]): DBIdMap<T> {
    const res = {};
    for (const row of data) {
        res[row.fieldData.slug] = row;
    }
    return res;
}

export function diff<T extends Webflow.CollectionItem>(logger: Logger, left: T[], right: T[]): { new: T[]; outdated: T[]; changed: T[] } {
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
        const right = { ...rightMap[dbId].fieldData, hash: '' };
        if (!isEqual(left, right)) {
            // We have to save the old item id, so that it can be used for the update operation
            rightMap[dbId].id = leftMap[dbId].id;
            changedEntries.push(rightMap[dbId]);
            logger.info('found diff in items', { left: JSON.stringify(left, null, 2), right: JSON.stringify(right, null, 2) });
        }
    }

    for (const dbId in rightMap) {
        if (!leftMap[dbId]) {
            newEntries.push(rightMap[dbId]);
        }
    }

    return { new: newEntries, outdated: outdatedEntries, changed: changedEntries };
}
