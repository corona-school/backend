import { ProjectField } from "../jufo/projectFields";
import { EnumReverseMappings } from "../util/enumReverseMapping";



/**
 * @apiDefine ProjectFieldInfo
 *
 * @apiSuccess (ProjectFieldInfo Object) {string} projectField Identifier for the project field, one of <code>"Arbeitswelt", "Biologie", "Chemie", "Geo-und-Raumwissenschaften", "Mathematik/Informatik", "Physik", "Technik"</code>
 * @apiSuccess (ProjectFieldInfo Object) {number} [max] Maximum grade for this project field. If this is set, <code>min</code> is required as well.
 * @apiSuccess (ProjectFieldInfo Object) {number} [min] Minimum grade for this project field. If this is set, <code>max</code> is required as well.
 */
type ProjectFieldInfo = {
    name: ProjectField;
    min?: number;
    max?: number;
};

/**
 * @apiDefine ProjectCoachingScreeningResult
 * @apiParam (JSON Body) {boolean} verified <code>true</code> if the student should be accepted as a project tutor, <code>false</code> otherwise
 * @apiParam (JSON Body) {string|undefined} commentScreener A comment by the screener
 * @apiParam (JSON Body) {string|undefined} knowscsfrom String from where the person knows Corona School's 1-on-1 project coaching
 * @apiParam (JSON Body) {string|undefined} screenerEmail The Screener's email address.
 * @apiParam (JSON Body) {string|undefined} feedback A string with feedback that should be stored.
 * @apiParam (JSON Body) {ProjectFieldInfo[]} projectFields An array of objects providing information on the person's selected project fields.
 */
export class ApiProjectCoachingScreeningResult {
    verified: boolean;
    commentScreener?: string;
    knowscsfrom?: string;
    screenerEmail: string;
    feedback?: string;
    projectFields: ProjectFieldInfo[];

    isValid(): boolean {
        return typeof this.verified === "boolean"
        && typeof this.screenerEmail === "string"
        && Array.isArray(this.projectFields)
        && this.projectFields.every(f => typeof f.name === "string"
                                    && EnumReverseMappings.ProjectField(f.name)
                                    && ((!f.min && !f.max) || (typeof f.min === "number" && typeof f.max === "number")));
    }
}