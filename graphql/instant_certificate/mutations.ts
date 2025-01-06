import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';
import { createInstantCertificate } from '../../common/certificate';
import { GraphQLContext } from '../context';
import { getSessionStudent } from '../authentication';
import { addFile, getFileURL } from '../files';
import { getLogger } from '../../common/logger/logger';

const logger = getLogger('MutateInstantCertificateResolver');
@Resolver((of) => GraphQLModel.Instant_certificate)
export class MutateInstantCertificateResolver {
    @Mutation((returns) => String)
    @Authorized(Role.STUDENT)
    async instantCertificateCreate(@Ctx() context: GraphQLContext, @Arg('lang') lang: string): Promise<string> {
        const student = await getSessionStudent(context);

        if (lang !== 'de' && lang !== 'en') {
            throw new Error('Unsupported language');
        }
        const { pdf, certificate } = await createInstantCertificate(student, lang);
        logger.info(`InstantCertificate(${certificate.id}) created for Student(${student.id})`);
        const file = addFile({
            buffer: pdf,
            mimetype: 'application/pdf',
            originalname: 'Zertifikat.pdf',
            size: pdf.length,
        });
        return getFileURL(file);
    }
}
