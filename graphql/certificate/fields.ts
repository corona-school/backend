import * as GraphQLModel from '../generated/models';
import { Pupil, Student } from '../generated/models';
import { Role } from '../authorizations';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { participation_certificate as ParticipationCertificate } from '@prisma/client';
import { getPupil, getStudent } from '../util';
import { LimitEstimated } from '../complexity';

@Resolver((of) => GraphQLModel.Participation_certificate)
export class ExtendedFieldsParticipationCertificateResolver {
    @FieldResolver((returns) => [String])
    @Authorized(Role.ADMIN, Role.STUDENT)
    subjectsFormatted(@Root() certificate: ParticipationCertificate) {
        return certificate.subjects.split(',');
    }

    @FieldResolver((returns) => Pupil)
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(1)
    pupil(@Root() certificate: ParticipationCertificate) {
        return getPupil(certificate.pupilId);
    }

    @FieldResolver((returns) => Student)
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(1)
    student(@Root() certificate: ParticipationCertificate) {
        return getStudent(certificate.pupilId);
    }
}
