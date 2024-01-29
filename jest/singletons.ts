import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

jest.mock('../common/prisma', () => ({
    __esModule: true,

    get prisma() {
        return prismaMock;
    },
}));

beforeEach(() => {
    mockReset(prismaMock);
});

export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<{
    // this is needed to resolve the issue with circular types definition
    // https://github.com/prisma/prisma/issues/10203
    [K in keyof PrismaClient]: Omit<PrismaClient[K], 'groupBy'>;
}>;
