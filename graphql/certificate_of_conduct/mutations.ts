import {Arg, Authorized, Mutation, Resolver} from "type-graphql";
import * as GraphQLModel from "../generated/models";
import {Role} from "../authorizations";
import * as Notification from "../../common/notification";

import {deactivateStudent} from "../../common/student/activation";
import {getStudent} from "../util";
import * as CertificateOfConduct from "../../common/certificate-of-conduct/certificateOfConduct";
import {updateCertificateOfConduct} from "../../common/student";
import {getLogger} from "log4js";
import {prisma} from "../../common/prisma";
const logger = getLogger("Certificate of Conduct");


@Resolver(of => GraphQLModel.Certificate_of_conduct)
export class MutateCertificateOfConductResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async certificateOfConductUpdate(@Arg("studentId") studentId: number,
        @Arg("criminalRecord") criminalRecord:boolean,
        @Arg("dateOfIssue") dateOfIssue: Date,
        @Arg("dateOfInspection") dateOfInspection: Date) {
        const student = await getStudent(studentId);
        if (criminalRecord) {
            logger.info(`Updating criminal record for student ${studentId}`);
            await deactivateStudent(student);
        }
        await updateCertificateOfConduct(student, criminalRecord, dateOfIssue, dateOfInspection);
        return true;
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async certificateOfConductCreate(
        @Arg("dateOfInspection") dateOfInspection: Date,
        @Arg("dateOfIssue") dateOfIssue: Date,
        @Arg("criminalRecords") criminalRecords: boolean,
        @Arg("studentId") studentId: number) {
        await CertificateOfConduct.create(dateOfInspection, dateOfIssue, criminalRecords, studentId);
        return true;
    }


    /*
     * Extends deadline until which student has to submit CoC by 4 weeks.
     */
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async certificateOfConductExtendDeadline(@Arg("studentId") studentId: number) {
        const student = await getStudent(studentId);
        let coc = await prisma.certificate_of_conduct.findUnique({
            where: {
                studentId: student.id
            }
        })
        if (coc != null) {
            logger.warn(`Tried to extend CoC deadline for student with ID ${studentId}, but student already submitted CoC.`);
            return false;
        }

        await prisma.student.update({
            where: {
                id: student.id
            },
            data: {
                extendedCoCDeadline: true
            }
        })
        logger.info(`Extended CoC deadline for student with ID ${studentId} by 4 weeks.`);
        await Notification.actionTaken(student, 'student_coc_deadline_extended', {});
        return true;
    }
}
