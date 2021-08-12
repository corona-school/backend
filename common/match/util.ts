import { Match } from "../entity/Match";

export function getJitsiTutoringLink(match: Match) {
    return `https://meet.jit.si/CoronaSchool-${encodeURIComponent(this.uuid)}`;
}