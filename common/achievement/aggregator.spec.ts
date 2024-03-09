import { aggregators } from './aggregator';

describe('test sum aggregator', () => {
    const tests: {
        name: string;
        elements: number[];
        expected: number;
    }[] = [
        {
            name: 'should sum all elements in array',
            elements: [1, 2, 3, 4, 5],
            expected: 15,
        },
        {
            name: 'should return 0 for empty array',
            elements: [],
            expected: 0,
        },
    ];

    it.each(tests)('$name', ({ elements, expected }) => {
        expect(aggregators['sum'].function(elements)).toEqual(expected);
    });
});

describe('test count aggregator', () => {
    const tests: {
        name: string;
        elements: number[];
        expected: number;
    }[] = [
        {
            name: 'should count all elements in array',
            elements: [1, 2, 3, 4, 5],
            expected: 5,
        },
        {
            name: 'should return 0 for empty array',
            elements: [],
            expected: 0,
        },
        {
            name: 'should skip elements that are zero',
            elements: [1, 0, 3, 0, 5],
            expected: 3,
        },
    ];

    it.each(tests)('$name', ({ elements, expected }) => {
        expect(aggregators['count'].function(elements)).toEqual(expected);
    });
});

describe('test presence_of_events aggregator', () => {
    const tests: {
        name: string;
        elements: number[];
        expected: number;
    }[] = [
        {
            name: 'should return 1 if at least one element is present',
            elements: [1, 2, 3, 4, 5],
            expected: 1,
        },
        {
            name: 'should return 0 for empty array',
            elements: [],
            expected: 0,
        },
        {
            name: 'should return 0 if all elements are zero',
            elements: [0, 0, 0, 0, 0],
            expected: 0,
        },
    ];

    it.each(tests)('$name', ({ elements, expected }) => {
        expect(aggregators['presence_of_events'].function(elements)).toEqual(expected);
    });
});

describe('test last_streak_length aggregator', () => {
    const tests: {
        name: string;
        elements: number[];
        expected: number;
    }[] = [
        {
            name: 'should get a streak of five',
            elements: [5, 4, 3, 2, 1],
            expected: 5,
        },
        {
            name: 'should not have a streak if no elements are present',
            elements: [],
            expected: 0,
        },
        {
            name: 'should reset streak if zero in chain',
            elements: [1, 0, 1, 1, 1],
            expected: 3,
        },
        {
            name: 'should have a streak of 0 if first element is zero',
            elements: [1, 1, 1, 1, 0],
            expected: 0,
        },
    ];

    it.each(tests)('$name', ({ elements, expected }) => {
        expect(aggregators['last_streak_length'].function(elements)).toEqual(expected);
    });
});
