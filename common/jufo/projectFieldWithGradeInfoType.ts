import { EnumReverseMappings } from "../util/enumReverseMapping";
import { ProjectField } from "./projectFields";

export type ProjectFieldWithGradeInfoType = {
    name: ProjectField;
    min?: number;
    max?: number;
};

export function isValidProjectFieldWithGradeInfo(pf: ProjectFieldWithGradeInfoType) {
    return typeof pf.name === "string"
        && !!EnumReverseMappings.ProjectField(pf.name)
        && ((pf.min || pf.max) ? typeof pf.min === "number" && typeof pf.max === "number" : true);
}