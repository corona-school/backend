import { getLogger } from "log4js";
import {prisma} from "../prisma";
import {deactivateStudent} from "../student/activation";
import {getStudent} from "../../graphql/util";
import * as Notification from "../notification";

const logger = getLogger("Certificate of Conduct");

export async function create(dateOfInspection, dateOfIssue, criminalRecords, inspectingScreenerId, studentId) {
    const student = await getStudent(studentId);
    const result = await prisma.certificate_of_conduct.create({
        data: {
            dateOfInspection: dateOfInspection,
            dateOfIssue: dateOfIssue,
            criminalRecords: criminalRecords,
            studentId: studentId
        }
    });
    logger.info(`Certificate of Conduct (${result.id}) created\n`);
    await Notification.actionTaken(student, 'student_coc_updated', {});
    if (criminalRecords) {
        await deactivateStudent(student);
    }
}