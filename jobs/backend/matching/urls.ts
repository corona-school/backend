import { Match } from "../../../common/entity/Match";

function callURLForMatch(m: Match) {
    return `https://meet.jit.si/CoronaSchool-${m.uuid}`;
}
function deregisterURLForStudentFromMatch(m: Match) {
    return `https://mail.corona-school.de/deregister?m=${m.uuid}&wid=${m.student.wix_id}&s=true`;
}
function deregisterURLForPupilFromMatch(m: Match) {
    return `https://mail.corona-school.de/deregister?m=${m.uuid}&wid=${m.pupil.wix_id}&s=false`;
}

export {
    callURLForMatch,
    deregisterURLForPupilFromMatch,
    deregisterURLForStudentFromMatch,
};
