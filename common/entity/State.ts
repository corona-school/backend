export enum State {
    BW = 'bw',
    BY = 'by',
    BE = 'be',
    BB = 'bb',
    HB = 'hb',
    HH = 'hh',
    HE = 'he',
    MV = 'mv',
    NI = 'ni',
    NW = 'nw',
    RP = 'rp',
    SL = 'sl',
    SN = 'sn',
    ST = 'st',
    SH = 'sh',
    TH = 'th',
    OTHER = 'other'
}
/**
 * This will return the written form of the subdomain used for the special registration page in several cooperations with Germany's states.
 * We have this method in contrast to the raw enum values, beause we wanna have "nrw.corona-school.de" vs "nw.corona-school.de".
 */
export function stateCooperationSubdomainPart(state: State): string {
    switch (state) {
        case "bw":
            return "bw";
        case "by":
            return "bayern";
        case "be":
            return "berlin";
        case "bb":
            return "brandenburg";
        case "hb":
            return "bremen";
        case "hh":
            return "hamburg";
        case "he":
            return "hessen";
        case "mv":
            return "mv";
        case "ni":
            return "niedersachsen";
        case "nw":
            return "nrw";
        case "rp":
            return "rlp";
        case "sl":
            return "saarland";
        case "sn":
            return "sachsen";
        case "st":
            return "sachsenanhalt";
        case "sh":
            return "sh";
        case "th":
            return "thueringen";
        default:
            return undefined;
    }
}

export const allStateCooperationSubdomains = Object.values(State).map(s => stateCooperationSubdomainPart(s))
    .filter(s => s);