import { computeMatchings, Matching, MatchOffer, MatchRequest, matchScore, NO_MATCH } from './matching';

function testScore(name: string, request: MatchRequest, offer: MatchOffer, expected: number) {
    it(name, () => {
        const actual = matchScore(request, offer);
        expect(actual).toEqual(expected);
    });
}

function test(name: string, requests: MatchRequest[], offers: MatchOffer[], expected: Matching, excludeMatchings: Set<string> = new Set()) {
    it(name, () => {
        const actual = computeMatchings(requests, offers, excludeMatchings);
        expect(actual).toEqual(expected);
    });
}

const requestOne = {
    grade: 10,
    pupilId: 1,
    state: 'at' as const,
    subjects: [{ name: 'Deutsch', mandatory: false }],
    requestAt: new Date(),
};

const requestTwo = {
    grade: 10,
    pupilId: 2,
    state: 'at' as const,
    subjects: [{ name: 'Mathematik', mandatory: false }],
    requestAt: new Date(),
};

const requestThree = {
    grade: 10,
    pupilId: 3,
    state: 'at' as const,
    subjects: [{ name: 'Klingonisch', mandatory: false }],
    requestAt: new Date(),
};

const requestFour = {
    grade: 10,
    pupilId: 4,
    state: 'at' as const,
    subjects: [
        { name: 'Mathematik', mandatory: false },
        { name: 'Deutsch', mandatory: false },
    ],
    requestAt: new Date(),
};

const requestFive = {
    grade: 10,
    pupilId: 5,
    state: 'at' as const,
    subjects: [
        { name: 'Mathematik', mandatory: true },
        { name: 'Deutsch', mandatory: false },
    ],
    requestAt: new Date(),
};

const offerOne = {
    studentId: 1,
    state: 'at' as const,
    subjects: [{ name: 'Deutsch', grade: { min: 1, max: 10 } }],
    requestAt: new Date(),
};

const offerTwo = {
    studentId: 2,
    state: 'at' as const,
    subjects: [{ name: 'Mathematik', grade: { min: 1, max: 10 } }],
    requestAt: new Date(),
};

const offerThree = {
    studentId: 3,
    state: 'at' as const,
    subjects: [{ name: 'Klingonisch', grade: { min: 1, max: 10 } }],
    requestAt: new Date(),
};

const offerFour = {
    studentId: 4,
    state: 'at' as const,
    subjects: [
        { name: 'Deutsch', grade: { min: 1, max: 10 } },
        { name: 'Mathematik', mandatory: false, grade: { min: 1, max: 10 } },
    ],
    requestAt: new Date(),
};

describe('Matching Score Basics', () => {
    testScore('no subject', requestOne, offerTwo, NO_MATCH);
    testScore('one subject', requestOne, offerOne, 1);
    testScore('two subjects', requestFour, offerFour, 2);
    testScore('two requested one offered', requestFour, offerOne, 1);
    testScore('one requested two offered', requestOne, offerFour, 1);
});

describe('Matching Score Mandatory', () => {
    testScore('mandatory not offered', requestFive, offerOne, NO_MATCH);
    testScore('mandatory offered', requestFive, offerTwo, 1);
});

describe('Matching Basics', () => {
    test('empty', [], [], []);
    test('one', [requestOne], [offerOne], [{ request: requestOne, offer: offerOne }]);
    test('none', [requestOne], [offerTwo], []);
    test(
        'three',
        [requestOne, requestTwo, requestThree],
        [offerThree, offerOne, offerTwo],
        [
            { offer: offerOne, request: requestOne },
            { offer: offerTwo, request: requestTwo },
            { offer: offerThree, request: requestThree },
        ]
    );

    test(
        'two subjects win over one',
        [requestOne, requestFour],
        [offerOne, offerFour],
        [
            { request: requestOne, offer: offerOne },
            { request: requestFour, offer: offerFour },
        ]
    );

    test('two subjects win over one - one request', [requestFour], [offerOne, offerFour], [{ request: requestFour, offer: offerFour }]);

    test('two subjects win over one - one offer', [requestOne, requestFour], [offerFour], [{ request: requestFour, offer: offerFour }]);
});

describe('Exclude duplicate matchings', () => {
    test('two offers, two requests only matched once', [requestOne, requestOne], [offerOne, offerOne], [{ request: requestOne, offer: offerOne }]);
    test('Matching excluded', [requestOne], [offerOne], [], new Set(['1/1']));
    test('Matching not excluded', [requestOne], [offerOne], [{ request: requestOne, offer: offerOne }], new Set(['1/2', '2/1']));
});
