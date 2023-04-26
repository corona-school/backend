import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { MentoringCategory } from "../../mentoring/categories";

export default class ContactMentorEvent extends LogUserEvent {
    constructor(user: Student, messageInfo: {category: MentoringCategory, text: string, subject?: string}) {
        super(LogType.CONTACT_MENTOR, user, messageInfo);
    }
}
