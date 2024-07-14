import { getLogger } from '../../../common/logger/logger';
import { diff } from './diff';
import { Webflow } from 'webflow-api';

interface TestData extends Webflow.CollectionItem {
    fieldData: {
        hash?: string;
        slug: string;
        data: string;
    };
}

function randomString(): string {
    return (Math.random() + 1).toString(36).substring(7);
}

function randomBool(): boolean {
    return Math.random() < 0.5;
}

function newTestObj(id: number, data: string): TestData {
    // We are randomizing the _id & _archived values, to make sure that they are ignored during hashing.
    const res: TestData = {
        id: randomString(),
        isArchived: randomBool(),
        isDraft: randomBool(),
        fieldData: {
            slug: `${id}`,
            data: data,
        },
    };
    // res.fieldData.hash = hash(res);
    return res;
}

describe('diff', () => {
    it('should not notice any changes', () => {
        const left: TestData[] = [newTestObj(1, 'foo')];
        const right: TestData[] = [newTestObj(1, 'foo')];
        const result = diff(getLogger('test'), left, right);

        expect(result.new).toStrictEqual([]);
        expect(result.outdated).toStrictEqual([]);
        expect(result.changed).toStrictEqual([]);
    });
    it('should notice a change in data', () => {
        const left: TestData = newTestObj(1, 'foo');
        const right: TestData = newTestObj(1, 'foobar');
        const result = diff(getLogger('test'), [left], [right]);

        expect(result.new).toStrictEqual([]);
        expect(result.outdated).toStrictEqual([]);
        expect(result.changed).toStrictEqual([{ ...right, id: left.id }]);
    });
    it('should create new object as id was not found', () => {
        const newObj = newTestObj(2, 'foo');
        const left: TestData[] = [newTestObj(1, 'foo')];
        const right: TestData[] = [newTestObj(1, 'foo'), newObj];
        const result = diff(getLogger('test'), left, right);

        expect(result.new).toStrictEqual([newObj]);
        expect(result.outdated).toStrictEqual([]);
        expect(result.changed).toStrictEqual([]);
    });
    it('should should remove missing object', () => {
        const oldObj = newTestObj(2, 'foo');
        const left: TestData[] = [newTestObj(1, 'foo'), oldObj];
        const right: TestData[] = [newTestObj(1, 'foo')];
        const result = diff(getLogger('test'), left, right);

        expect(result.new).toStrictEqual([]);
        expect(result.outdated).toStrictEqual([oldObj]);
        expect(result.changed).toStrictEqual([]);
    });
    it('should notice a diff in id even if the hash is the same', () => {
        const oldObj = newTestObj(1, 'foo');
        const newObj = structuredClone(oldObj) as TestData;
        newObj.fieldData.slug = '2';

        const left: TestData[] = [oldObj];
        const right: TestData[] = [newObj];

        const result = diff(getLogger('test'), left, right);

        expect(result.new).toStrictEqual([newObj]);
        expect(result.outdated).toStrictEqual([oldObj]);
        expect(result.changed).toStrictEqual([]);
    });
});
