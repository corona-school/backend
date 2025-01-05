import { computeMatchings, Matching, MatchOffer, MatchRequest, matchScore, NO_MATCH } from './matching';

function testScore(name: string, request: MatchRequest, offer: MatchOffer, expected: number) {
    it(name, () => {
        const actual = matchScore(request, offer);
        expect(actual).toEqual(expected);
    });
}

function test(name: string, requests: MatchRequest[], offers: MatchOffer[], expected: Matching, excludeMatchings: Set<string> = new Set()) {
    it(name, () => {
        const actual = computeMatchings(requests, offers, excludeMatchings, new Date(100000000000));
        expect(actual).toEqual(expected);
    });
}

const requestOne = {
    grade: 10,
    pupilId: 1,
    state: 'at' as const,
    subjects: [{ name: 'Deutsch', mandatory: false }],
    requestAt: new Date(0),
};

const requestTwo = {
    grade: 10,
    pupilId: 2,
    state: 'at' as const,
    subjects: [{ name: 'Mathematik', mandatory: false }],
    requestAt: new Date(0),
};

const requestThree = {
    grade: 10,
    pupilId: 3,
    state: 'at' as const,
    subjects: [{ name: 'Klingonisch', mandatory: false }],
    requestAt: new Date(0),
};

const requestFour = {
    grade: 10,
    pupilId: 4,
    state: 'at' as const,
    subjects: [
        { name: 'Mathematik', mandatory: false },
        { name: 'Deutsch', mandatory: false },
    ],
    requestAt: new Date(0),
};

const requestFive = {
    grade: 10,
    pupilId: 5,
    state: 'at' as const,
    subjects: [
        { name: 'Mathematik', mandatory: true },
        { name: 'Deutsch', mandatory: false },
    ],
    requestAt: new Date(0),
};

const requestSix = {
    grade: 10,
    pupilId: 5,
    state: 'at' as const,
    subjects: [{ name: 'Mathematik' }, { name: 'Deutsch' }],
    requestAt: new Date(0),
    onlyMatchWith: 'female' as const,
};

const requestSeven = {
    grade: 10,
    pupilId: 5,
    state: 'at' as const,
    subjects: [{ name: 'Mathematik' }, { name: 'Deutsch' }],
    requestAt: new Date(0),
    hasSpecialNeeds: true,
};

const offerOne = {
    studentId: 1,
    state: 'at' as const,
    subjects: [{ name: 'Deutsch', grade: { min: 1, max: 10 } }],
    requestAt: new Date(0),
};

const offerTwo = {
    studentId: 2,
    state: 'at' as const,
    subjects: [{ name: 'Mathematik', grade: { min: 1, max: 10 } }],
    requestAt: new Date(0),
};

const offerThree = {
    studentId: 3,
    state: 'at' as const,
    subjects: [{ name: 'Klingonisch', grade: { min: 1, max: 10 } }],
    requestAt: new Date(0),
};

const offerFour = {
    studentId: 4,
    state: 'at' as const,
    subjects: [
        { name: 'Deutsch', grade: { min: 1, max: 10 } },
        { name: 'Mathematik', mandatory: false, grade: { min: 1, max: 10 } },
    ],
    requestAt: new Date(0),
    gender: 'male' as const,
    hasSpecialExperience: false,
};

const offerFive = {
    studentId: 4,
    state: 'bw' as const,
    subjects: [
        { name: 'Deutsch', grade: { min: 1, max: 10 } },
        { name: 'Mathematik', mandatory: false, grade: { min: 1, max: 10 } },
    ],
    requestAt: new Date(0),
    gender: 'female' as const,
    hasSpecialExperience: true,
};

describe('Matching Score Basics', () => {
    testScore('no subject', requestOne, offerTwo, NO_MATCH);
    testScore('one subject', requestOne, offerOne, 0.6000000000000001);
    testScore('two subjects', requestFour, offerFour, 0.9046376623823058);
    testScore('two requested one offered', requestFour, offerOne, 0.6000000000000001);
    testScore('one requested two offered', requestOne, offerFour, 0.6000000000000001);
    // testScore('one requested two offered - different state', requestOne, offerFive, 0.495);
});

describe('Matching Score Mandatory', () => {
    testScore('mandatory not offered', requestFive, offerOne, NO_MATCH);
    testScore('mandatory offered', requestFive, offerTwo, 0.6000000000000001);
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

describe('Gender Constraint', () => {
    // Unknown offer Gender -> No Match
    test('', [requestSix], [offerOne], []);
    // Gender Mismatch -> No Match
    test('', [requestSix], [offerFour], []);
    // Matching Gender -> Match
    test('', [requestSix], [offerFive], [{ request: requestSix, offer: offerFive }]);
});

describe('Special Needs Constraint', () => {
    // Unknown offer experience -> No Match
    test('', [requestSeven], [offerOne], []);
    // No offer experience -> No Match
    test('', [requestSeven], [offerFour], []);
    // Offer experience -> Match
    test('', [requestSeven], [offerFive], [{ request: requestSeven, offer: offerFive }]);
});
