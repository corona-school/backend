import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { participation_certificate as ParticipationCertificate } from '@prisma/client';

@Resolver((of) => GraphQLModel.Participation_certificate)
export class ExtendedFieldsParticipationCertificateResolver {
    @FieldResolver((returns) => [String])
    @Authorized(Role.ADMIN, Role.STUDENT)
    subjectsFormatted(@Root() certificate: ParticipationCertificate) {
        return certificate.subjects.split(',');
    }
}
