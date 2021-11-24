import {student as Student} from "@prisma/client";
import {prisma} from "../prisma";

export async function updateCertificateOfConduct(student : Student, criminalRecord: boolean, dateOfIssue: Date, dateOfInspection: Date) {
    if (!student.active) {
        throw new Error("Student was deactivated. Trying to add certificate.");
    }

    await prisma.certificate_of_conduct.update({
        where: {
            studentId: student.id
        },
        data: {
            criminalRecords: criminalRecord,
            dateOfInspection: dateOfInspection,
            dateOfIssue: dateOfIssue
        }
    });
}
