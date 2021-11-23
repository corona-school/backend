import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx, InputType, Field } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { Role } from "../authorizations";
import { createCertificate, signCertificate, ICertificateCreationParams, CertificateState, getCertificatePDF, Language, LANGUAGES } from "../../common/certificate";
import { GraphQLContext } from "../context";
import { getSessionPupil, getSessionStudent } from "../authentication";
import { IsIn } from "class-validator";

@InputType()
class CertificateCreationInput implements ICertificateCreationParams {
    @Field()
    endDate: number;
    @Field()
    subjects: string;
    @Field()
    hoursPerWeek: number;
    @Field()
    hoursTotal: number;
    @Field()
    medium: string;
    @Field()
    activities: string;
    @Field()
    ongoingLessons: boolean;
    @Field()
    @IsIn([CertificateState.manual, CertificateState.awaitingApproval])
    state: CertificateState.manual | CertificateState.awaitingApproval;
}

@Resolver(of => GraphQLModel.Participation_certificate)
export class MutateParticipationCertificateResolver {

    @Mutation(returns => Boolean)
    @Authorized(Role.PUPIL)
    async participationCertificateSign(
        @Ctx() context: GraphQLContext,
        @Arg("certificateId") certificateId: string,
        @Arg("signaturePupil", { nullable: true }) signaturePupil: string | null,
        @Arg("signatureParent", { nullable: true }) signatureParent: string | null,
        @Arg("signatureLocation") signatureLocation: string): Promise<boolean> {

        const pupil = await getSessionPupil(context);

        if (!signaturePupil && !signatureParent) {
            throw new Error(`Either signatureParent or signaturePupil must be present`);
        }

        await signCertificate(certificateId, pupil, signatureParent, signaturePupil, signatureLocation);
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT)
    async participationCertificateCreate(@Ctx() context: GraphQLContext, @Arg("pupilId") pupilId: number, @Arg("certificateData") certificateData: CertificateCreationInput): Promise<boolean> {
        const requestor = await getSessionStudent(context);
        await createCertificate(requestor, pupilId, certificateData);
        return true;
    }

    @Mutation(returns => String)
    @Authorized(Role.STUDENT)
    async participationCertificateAsPDF(@Ctx() context, @Arg("uuid") uuid: string, @Arg("language") language: string) {
        if (!LANGUAGES.includes(language as Language)) {
            throw new Error(`Unknown language '${language}'`);
        }

        const student = await getSessionStudent(context);
        const pdf = await getCertificatePDF(uuid, student, language as Language);
        return pdf.toString("utf-8");
    }
}