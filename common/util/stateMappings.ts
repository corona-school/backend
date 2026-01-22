import { pupil_state_enum, school_state_enum } from '@prisma/client';

// Define a type for the state codes based on the enum
type StateCode = keyof typeof pupil_state_enum;

// Create a mapping object for state codes to full names
const stateMap: Record<StateCode, string> = {
    bw: 'Baden-Württemberg',
    by: 'Bayern',
    be: 'Berlin',
    bb: 'Brandenburg',
    hb: 'Bremen',
    hh: 'Hamburg',
    he: 'Hessen',
    mv: 'Mecklenburg-Vorpommern',
    ni: 'Niedersachsen',
    nw: 'Nordrhein-Westfalen',
    rp: 'Rheinland-Pfalz',
    sl: 'Saarland',
    sn: 'Sachsen',
    st: 'Sachsen-Anhalt',
    sh: 'Schleswig-Holstein',
    th: 'Thüringen',
    at: 'Austria',
    ch: 'Switzerland',
    other: 'Other',
};

/**
 * Gets the full name of a state from its code.
 * @param stateCode - The state code.
 * @returns The full name of the state.
 */
export function getStateFullName(stateCode: StateCode): string {
    return stateMap[stateCode] || 'Unknown';
}

const stateToZipRanges: { [key in keyof typeof school_state_enum]: { min: number; max: number }[] } = {
    sn: [
        { min: 1067, max: 1936 },
        { min: 2625, max: 2999 },
        { min: 4103, max: 4575 },
        { min: 4643, max: 4889 },
        { min: 8056, max: 9669 },
    ],
    st: [
        { min: 6108, max: 6543 },
        { min: 6618, max: 6925 },
        { min: 38820, max: 39649 },
    ],
    th: [
        { min: 4600, max: 4639 },
        { min: 6556, max: 6578 },
        { min: 7318, max: 7987 },
        { min: 36404, max: 36469 },
        { min: 37308, max: 37359 },
        { min: 98527, max: 99998 },
    ],
    be: [{ min: 10115, max: 14199 }],
    bb: [
        { min: 1945, max: 1998 },
        { min: 3042, max: 3253 },
        { min: 4895, max: 4938 },
        { min: 14467, max: 16949 },
    ],
    mv: [
        { min: 17033, max: 19417 },
        { min: 23923, max: 23999 },
    ],
    hh: [
        { min: 20095, max: 21149 },
        { min: 22041, max: 22769 },
        { min: 27499, max: 27499 },
    ],
    sh: [
        { min: 21465, max: 21529 },
        { min: 22844, max: 23919 },
        { min: 24103, max: 25999 },
    ],
    ni: [
        { min: 21217, max: 21449 },
        { min: 21614, max: 21789 },
        { min: 26121, max: 27478 },
        { min: 27607, max: 27809 },
        { min: 28790, max: 31868 },
        { min: 37073, max: 37199 },
        { min: 37412, max: 38729 },
        { min: 48455, max: 48465 },
        { min: 48488, max: 48488 },
        { min: 48499, max: 48531 },
        { min: 49074, max: 49459 },
        { min: 49565, max: 49849 },
    ],
    hb: [
        { min: 27568, max: 27580 },
        { min: 28195, max: 28779 },
    ],
    he: [
        { min: 34117, max: 36399 },
        { min: 37213, max: 37299 },
        { min: 60306, max: 63699 },
        { min: 64283, max: 65936 },
    ],
    nw: [
        { min: 32049, max: 33829 },
        { min: 40210, max: 48739 },
        { min: 49477, max: 49549 },
        { min: 50126, max: 53359 },
        { min: 53604, max: 57072 },
        { min: 57489, max: 58089 },
        { min: 59969, max: 59969 },
    ],
    rp: [
        { min: 53424, max: 53579 },
        { min: 53949, max: 56869 },
        { min: 57518, max: 57648 },
        { min: 66482, max: 66509 },
        { min: 66849, max: 67829 },
        { min: 76726, max: 76891 },
    ],
    sl: [
        { min: 66111, max: 66459 },
        { min: 66538, max: 66839 },
    ],
    bw: [
        { min: 68159, max: 76709 },
        { min: 77652, max: 79879 },
        { min: 88045, max: 88099 },
        { min: 88212, max: 89198 },
        { min: 89518, max: 89619 },
        { min: 97922, max: 97999 },
    ],
    by: [
        { min: 63739, max: 63939 },
        { min: 80331, max: 87789 },
        { min: 88131, max: 88179 },
        { min: 89231, max: 89447 },
        { min: 90402, max: 97909 },
    ],
    at: [],
    ch: [],
    other: [],
};

export const getStateFromZip = (zip: number) => {
    for (const state in stateToZipRanges) {
        const ranges = stateToZipRanges[state as keyof typeof school_state_enum];
        for (const range of ranges) {
            if (zip >= range.min && zip <= range.max) {
                return state;
            }
        }
    }
    return school_state_enum.other;
};
