import { Arg, Authorized, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';
import {
    CertificateState,
    createCertificate,
    getCertificatePDF,
    ICertificateCreationParams,
    issueCertificateRequest,
    Language,
    LANGUAGES,
    signCertificate,
} from '../../common/certificate';
import { GraphQLContext } from '../context';
import { getSessionPupil, getSessionStudent } from '../authentication';
import { IsIn } from 'class-validator';
import { ValidationError } from '../error';
import { addFile, getFileURL } from '../files';
import { prisma } from '../../common/prisma';

@InputType()
class CertificateCreationInput implements ICertificateCreationParams {
    @Field({ nullable: true })
    startDate?: Date;
    @Field()
    endDate: Date;
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

@InputType()
class CertificateUpdateInput {
    @Field({ nullable: true })
    startDate?: Date;
    @Field({ nullable: true })
    endDate?: Date;
    @Field({ nullable: true })
    subjects?: string;
    @Field({ nullable: true })
    hoursPerWeek?: number;
    @Field({ nullable: true })
    hoursTotal?: number;
    @Field({ nullable: true })
    medium?: string;
    @Field({ nullable: true })
    activities?: string;
    @Field({ nullable: true })
    ongoingLessons?: boolean;
}

@Resolver((of) => GraphQLModel.Participation_certificate)
export class MutateParticipationCertificateResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.PUPIL)
    async participationCertificateSign(
        @Ctx() context: GraphQLContext,
        @Arg('certificateId') certificateId: string,
        @Arg('signaturePupil', { nullable: true }) signaturePupil: string | null,
        @Arg('signatureParent', { nullable: true }) signatureParent: string | null,
        @Arg('signatureLocation') signatureLocation: string
    ): Promise<boolean> {
        const pupil = await getSessionPupil(context);

        if (!signaturePupil && !signatureParent) {
            throw new ValidationError(`Either signatureParent or signaturePupil must be present`);
        }

        await signCertificate(certificateId, pupil, signatureParent, signaturePupil, signatureLocation);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.STUDENT)
    async participationCertificateCreate(
        @Ctx() context: GraphQLContext,
        @Arg('matchId') matchId: string,
        @Arg('certificateData') certificateData: CertificateCreationInput
    ): Promise<boolean> {
        const requestor = await getSessionStudent(context);
        await createCertificate(requestor, matchId, certificateData);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.STUDENT)
    async participationCertificateUpdate(
        @Ctx() context: GraphQLContext,
        @Arg('certificateId') certificateId: string,
        @Arg('data') data: CertificateUpdateInput
    ): Promise<boolean> {
        const cert = await prisma.participation_certificate.findUnique({ where: { uuid: certificateId } });
        if (!cert) {
            throw new Error("Couldn't find certificate.");
        }
        if (cert.state !== 'awaiting-approval') {
            throw new Error('This participation certificate is already finalized and cannot be changed anymore.');
        }

        await prisma.participation_certificate.update({
            where: {
                uuid: certificateId,
            },
            data: {
                startDate: data.startDate,
                endDate: data.endDate,
                subjects: data.subjects,
                hoursPerWeek: data.hoursPerWeek,
                hoursTotal: data.hoursTotal,
                medium: data.medium,
                categories: data.activities,
                ongoingLessons: data.ongoingLessons,
            },
        });
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.STUDENT)
    async participationCertificateNotify(@Ctx() context: GraphQLContext, @Arg('certificateId') certificateId: string): Promise<boolean> {
        const pc = await prisma.participation_certificate.findUnique({ where: { uuid: certificateId }, include: { pupil: true, student: true } });
        await issueCertificateRequest(pc);
        return true;
    }

    @Mutation((returns) => String)
    @Authorized(Role.STUDENT)
    async participationCertificateAsPDF(@Ctx() context, @Arg('uuid') uuid: string, @Arg('language') language: string) {
        if (!LANGUAGES.includes(language as Language)) {
            throw new Error(`Unknown language '${language}'`);
        }

        const student = await getSessionStudent(context);
        const pdf = await getCertificatePDF(uuid, student, language as Language);
        const file = addFile({
            buffer: pdf,
            mimetype: 'application/pdf',
            originalname: 'Zertifikat.pdf',
            size: pdf.length,
        });
        return getFileURL(file);
    }
}
