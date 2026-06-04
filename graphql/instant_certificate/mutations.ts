import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';
import { createInstantCertificate } from '../../common/certificate';
import { GraphQLContext } from '../context';
import { getSessionStudent } from '../authentication';
import { addFile, getFileURL } from '../files';
import { getLogger } from '../../common/logger/logger';
import moment from 'moment';

const logger = getLogger('MutateInstantCertificateResolver');
@Resolver((of) => GraphQLModel.Instant_certificate)
export class MutateInstantCertificateResolver {
    @Mutation((returns) => String)
    @Authorized(Role.STUDENT)
    async instantCertificateCreate(
        @Ctx() context: GraphQLContext,
        @Arg('lang') lang: string,
        @Arg('hasCompletedTraining') hasCompletedTraining: boolean
    ): Promise<string> {
        const student = await getSessionStudent(context);

        if (lang !== 'de' && lang !== 'en') {
            throw new Error('Unsupported language');
        }
        const { pdf, certificate } = await createInstantCertificate(student, lang, hasCompletedTraining);
        logger.info(`InstantCertificate(${certificate.id}) created for Student(${student.id})`);
        const file = addFile({
            buffer: pdf,
            mimetype: 'application/pdf',
            originalname: `${moment().format('YYYYMMDD')}_${certificate.isInternship ? 'Praktikumsbescheinigung' : 'Ehrenamtsbescheinigung'}_Lern-Fair.pdf`,
            size: pdf.length,
        });
        return getFileURL(file);
    }
}
