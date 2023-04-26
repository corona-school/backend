import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";
import { ProjectMatch } from "../../entity/ProjectMatch";

export default class ProjectMatchDissolveEvent extends LogUserEvent {
    constructor(user: Pupil | Student, projectMatch: ProjectMatch) {
        super(LogType.PROJECT_MATCH_DISSOLVE, user, {
            projectMatchId: projectMatch.id
        });
    }
}
