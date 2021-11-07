import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx, InputType, Field } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { Role } from "../authorizations";
import { createCertificate, signCertificate, ICertificateCreationParams, CertificateState } from "../../common/certificate";
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
    @Authorized(Role.STUDENT)
    async participationCertificateSign(
        @Ctx() context: GraphQLContext,
        @Arg("certificateId") certificateId: string,
        @Arg("signaturePupil", { nullable: true }) signaturePupil: string | null,
        @Arg("signatureParent", { nullable: true }) signatureParent: string | null,
        @Arg("signatureLocation") signatureLocation: string): Promise<boolean> {

        const pupil = await getSessionPupil(context);

        if(!signaturePupil && !signatureParent)
            throw new Error(`Either signatureParent or signaturePupil must be present`);

        await signCertificate(certificateId, pupil, signatureParent, signaturePupil, signatureLocation);
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async participationCertificateCreate(@Ctx() context: GraphQLContext, @Arg("pupilId") pupilId: number, @Arg("certificateData") certificateData: CertificateCreationInput): Promise<boolean> {
        const requestor = await getSessionStudent(context);
        await createCertificate(requestor, pupilId, certificateData);
        return true;
    }
}