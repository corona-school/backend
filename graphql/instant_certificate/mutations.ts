import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';
import { createInstantCertificate, createInstantPDFBinary, getCertificateLink } from '../../common/certificate';
import { GraphQLContext } from '../context';
import { getSessionStudent } from '../authentication';
import { addFile, getFileURL } from '../files';
import { getLogger } from '../../common/logger/logger';
import moment from 'moment';
import { prisma } from '../../common/prisma';

const logger = getLogger('MutateInstantCertificateResolver');
@Resolver((of) => GraphQLModel.Instant_certificate)
export class MutateInstantCertificateResolver {
    @Mutation((returns) => String)
    @Authorized(Role.STUDENT)
    async instantCertificateCreate(
        @Ctx() context: GraphQLContext,
        @Arg('lang') lang: string,
        @Arg('internshipId', () => Int, { nullable: true }) internshipId?: number
    ): Promise<string> {
        const student = await getSessionStudent(context);

        if (lang !== 'de' && lang !== 'en') {
            throw new Error('Unsupported language');
        }
        const { pdf, certificate } = await createInstantCertificate(student, lang, internshipId);
        logger.info(`InstantCertificate(${certificate.id}) created for Student(${student.id})`);
        const file = addFile({
            buffer: pdf,
            mimetype: 'application/pdf',
            originalname: `${moment().format('YYYYMMDD')}_${certificate.isInternship ? 'Praktikumsbescheinigung' : 'Ehrenamtsbescheinigung'}_Lern-Fair.pdf`,
            size: pdf.length,
        });
        return getFileURL(file);
    }

    @Mutation((returns) => String)
    @Authorized(Role.STUDENT)
    async downloadInstantCertificate(
        @Ctx() context: GraphQLContext,
        @Arg('lang') lang: string,
        @Arg('certificateId', () => Int) certificateId: number
    ): Promise<string> {
        const student = await getSessionStudent(context);

        if (lang !== 'de' && lang !== 'en') {
            throw new Error('Unsupported language');
        }
        const certificate = await prisma.instant_certificate.findFirst({
            where: { id: certificateId, studentId: student.id },
            include: { student: true },
        });
        if (!certificate) {
            throw new Error('Certificate not found');
        }

        const pdf = await createInstantPDFBinary(certificate, getCertificateLink(certificate, lang, 'instant'), lang);
        const file = addFile({
            buffer: pdf,
            mimetype: 'application/pdf',
            originalname: `${moment().format('YYYYMMDD')}_${certificate.isInternship ? 'Praktikumsbescheinigung' : 'Ehrenamtsbescheinigung'}_Lern-Fair.pdf`,
            size: pdf.length,
        });
        return getFileURL(file);
    }
}
