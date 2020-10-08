import {Division, Expertise} from "../../common/entity/Mentor";
import {getLogger} from "log4js";
import {ApiAddSubject} from "./format";
import {checkSubject} from "./userController/format";

const logger = getLogger();

export function checkSubjects(subjects: ApiAddSubject[]) {
    if (subjects.length > 0) {
        for (let i = 0; i < subjects.length; i++) {
            if (!checkSubject(subjects[i].name)) {
                logger.warn("Subjects contain invalid subject " + subjects[i].name);
                return null;
            }
        }
    }
    return JSON.stringify(subjects);
}

export function checkDivisions(divisions: string[]) {
    let result: Division[] = [];
    if (divisions.length > 0) {
        for (let i = 0; i < divisions.length; i++) {
            if (divisions[i].toUpperCase() in Division) {
                result.push(Division[divisions[i].toUpperCase()]);
            } else {
                logger.warn("Division '" + divisions[i] + "' is not a correct division");
                return null;
            }
        }
    }
    return result;
}

export function checkExpertises(expertises: string[]) {
    let result: Expertise[] = [];
    if (expertises.length > 0) {
        const expertiseValues: string[] = Object.keys(Expertise).map(key => Expertise[key]).filter(k => !(parseInt(k) >= 0));
        for (let expertise of expertises) {
            if (expertiseValues.indexOf(expertise) > -1) {
                const expertiseKey = Object.keys(Expertise).filter(x => Expertise[x] === expertise);
                result.push(Expertise[expertiseKey[0]]);
            } else {
                logger.warn("Expertise '" + expertise + "' is not a correct expertise");
                return null;
            }
        }
    }
    return result;
}
