import LogUserEvent from "./LogUserEvent";
import {Student} from "../../entity/Student";
import {Pupil} from "../../entity/Pupil";
import {ApiContactExpert} from "../../../web/controllers/expertController/format";
import LogType from "./LogType";

export default class ContactExpertEvent extends LogUserEvent {
    constructor(user: Pupil | Student, messageInfo: ApiContactExpert) {
        super(LogType.CONTACT_EXPERT, user, messageInfo);
    }
}