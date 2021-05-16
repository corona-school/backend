import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";
import {Mentor} from "../../entity/Mentor";

export default class UpdatePersonalEvent extends LogUserEvent {
    constructor(user: Pupil | Student | Mentor, oldUser: Pupil | Student | Mentor) {
        super(
            LogType.UPDATE_PERSONAL,
            user,
            UpdatePersonalEvent.objDiff(user, oldUser)
        ); // The parameters in objDiff are swapped, since we are interested in the old data
    }

    static objDiff(oldObj: any, newObj: any): any {
        console.log("objDiff()", oldObj, newObj);

        const oldKeys = Object.keys(oldObj);
        const newKeys = Object.keys(newObj);

        let diff: any = {};
        newKeys.forEach((key, index) => {
            console.log("key: " + key);

            // Add all new keys
            if (oldKeys.indexOf(key) == -1) { diff[key] = newObj[key]; } else if (oldObj[key] != newObj[key]) { diff[key] = newObj[key]; } else { console.log("unchanged"); } // Add all keys that changed
        });

        console.log("diff", diff);

        return diff;
    }
}
