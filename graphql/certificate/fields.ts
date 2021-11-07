import * as GraphQLModel from "../generated/models";
import { Role } from "../authorizations";
import { Arg, Authorized, Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { participation_certificate as ParticipationCertificate } from "@prisma/client";
import { getCertificatePDF, Language, LANGUAGES } from "../../common/certificate";
import { getSessionStudent } from "../authentication";

@Resolver(of => GraphQLModel.Participation_certificate)
export class ExtendedFieldsParticipationCertificateResolver {
    @FieldResolver(returns => String)
    @Authorized(Role.STUDENT)
    async pdf(@Ctx() context, @Root() certificate: ParticipationCertificate, @Arg("language") language: string) {
        if (!LANGUAGES.includes(language as Language)) {
            throw new Error(`Unknown language '${language}'`);
        }

        const student = await getSessionStudent(context);
        return await getCertificatePDF(certificate.uuid, student, language as Language);
    }

    @FieldResolver(returns => [String])
    @Authorized(Role.ADMIN, Role.STUDENT)
    subjectsFormatted(@Root() certificate: ParticipationCertificate) {
        return certificate.subjects.split(",");
    }
}