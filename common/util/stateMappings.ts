import { pupil_state_enum } from '@prisma/client';

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
