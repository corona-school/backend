import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';

import { deactivateStudent } from '../../common/student/activation';
import { getStudent } from '../util';
import * as CertificateOfConduct from '../../common/certificate-of-conduct/certificateOfConduct';
import { updateCertificateOfConduct } from '../../common/student';
import { getLogger } from '../../common/logger/logger';
import { DeactivationReason } from '../../common/user';

const logger = getLogger('Certificate of Conduct');

@Resolver((of) => GraphQLModel.Certificate_of_conduct)
export class MutateCertificateOfConductResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async certificateOfConductUpdate(
        @Arg('studentId') studentId: number,
        @Arg('criminalRecord') criminalRecord: boolean,
        @Arg('dateOfIssue') dateOfIssue: Date,
        @Arg('dateOfInspection') dateOfInspection: Date
    ) {
        const student = await getStudent(studentId);
        if (criminalRecord) {
            logger.info(`Updating criminal record for student ${studentId}`);
            await deactivateStudent(student, false, DeactivationReason.hasCriminalRecord);
        }
        await updateCertificateOfConduct(student, criminalRecord, dateOfIssue, dateOfInspection);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async certificateOfConductCreate(
        @Arg('dateOfInspection') dateOfInspection: Date,
        @Arg('dateOfIssue') dateOfIssue: Date,
        @Arg('criminalRecords') criminalRecords: boolean,
        @Arg('studentId') studentId: number
    ) {
        await CertificateOfConduct.create(dateOfInspection, dateOfIssue, criminalRecords, studentId);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async certificateOfConductDelete(@Arg('studentId') studentId: number) {
        await CertificateOfConduct.attemptDeleteStaleCoC(studentId);
        return true;
    }
}
