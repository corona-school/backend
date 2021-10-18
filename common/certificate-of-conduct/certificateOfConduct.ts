import {Prisma} from "@prisma/client";
import { getLogger } from "log4js";
import {prisma} from "../prisma";
import {deactivateStudent} from "../student/activation";
import {getStudent} from "../../graphql/util";
const logger = getLogger("Certificate of Conduct");

export async function create(dateOfInspection, dateOfIssue, criminalRecords, inspectingScreenerId, studentId) {
    if (!criminalRecords) {
        const result = await prisma.certificate_of_conduct.create({
            data: {
                dateOfInspection: dateOfInspection,
                dateOfIssue: dateOfIssue,
                criminalRecords: criminalRecords,
                inspectingScreenerId: inspectingScreenerId,
                studentId: studentId
            }
        });

        logger.info(`Certificate of Conduct (${result.id}) created\n`);
    } else {
        const student = await getStudent(studentId);
        await deactivateStudent(student);
        //TODO: Get the student and dissolve the matches, delete courses if sole instructor, and remove from course if there are other instructors.
    }
}