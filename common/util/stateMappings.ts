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
    sn: [{ min: 1000, max: 5999 }],
    st: [{ min: 6000, max: 6999 }],
    th: [{ min: 7000, max: 7999 }],
    be: [{ min: 10000, max: 14999 }],
    bb: [{ min: 15000, max: 16999 }],
    mv: [{ min: 17000, max: 19999 }],
    hh: [{ min: 20000, max: 22999 }],
    sh: [{ min: 23000, max: 25999 }],
    ni: [
        { min: 26000, max: 27999 },
        { min: 29000, max: 33999 },
    ],
    hb: [{ min: 28000, max: 28999 }],
    he: [{ min: 34000, max: 36999 }],
    nw: [{ min: 40000, max: 53999 }],
    rp: [{ min: 54000, max: 59999 }],
    sl: [{ min: 66000, max: 66999 }],
    bw: [
        { min: 70000, max: 79999 },
        { min: 88000, max: 88364 },
    ],
    by: [
        { min: 80000, max: 87999 },
        { min: 88365, max: 89999 },
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
