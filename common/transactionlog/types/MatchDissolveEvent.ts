import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";
import { Match } from "../../entity/Match";

export default class MatchDissolveEvent extends LogUserEvent {
    constructor(user: Pupil | Student, match: Match) {
        super(LogType.MATCH_DISSOLVE, user, {
            matchId: match.id,
        });
    }
}
