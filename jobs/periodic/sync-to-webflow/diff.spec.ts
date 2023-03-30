import { diff, hash } from './diff';
import { WebflowMetadata } from './webflow-adapter';

interface TestData extends WebflowMetadata {
    data: string;
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
        _id: randomString(),
        _archived: randomBool(),
        _draft: randomBool(),
        slug: '',
        databaseid: `${id}`,
        data: data,
    };
    res.slug = hash(res);
    return res;
}

describe('diff', () => {
    it('should not notice any changes', () => {
        const left: TestData[] = [newTestObj(1, 'foo')];
        const right: TestData[] = [newTestObj(1, 'foo')];
        const result = diff(left, right);

        expect(result.new).toStrictEqual([]);
        expect(result.outdated).toStrictEqual([]);
    });
    it('should notice a change in data', () => {
        const left: TestData[] = [newTestObj(1, 'foo')];
        const right: TestData[] = [newTestObj(1, 'foobar')];
        const result = diff(left, right);

        expect(result.new).toStrictEqual(right);
        expect(result.outdated).toStrictEqual(left);
    });
    it('should create new object as id was not found', () => {
        const newObj = newTestObj(2, 'foo');
        const left: TestData[] = [newTestObj(1, 'foo')];
        const right: TestData[] = [newTestObj(1, 'foo'), newObj];
        const result = diff(left, right);

        expect(result.new).toStrictEqual([newObj]);
        expect(result.outdated).toStrictEqual([]);
    });
    it('should should remove missing object', () => {
        const oldObj = newTestObj(2, 'foo');
        const left: TestData[] = [newTestObj(1, 'foo'), oldObj];
        const right: TestData[] = [newTestObj(1, 'foo')];
        const result = diff(left, right);

        expect(result.new).toStrictEqual([]);
        expect(result.outdated).toStrictEqual([oldObj]);
    });
    it('should notice a diff in id even if the hash is the same', () => {
        const oldObj = newTestObj(1, 'foo');
        const newObj = structuredClone(oldObj) as TestData;
        newObj.databaseid = '2';

        const left: TestData[] = [oldObj];
        const right: TestData[] = [newObj];

        const result = diff(left, right);

        expect(result.new).toStrictEqual([newObj]);
        expect(result.outdated).toStrictEqual([oldObj]);
    });
});
