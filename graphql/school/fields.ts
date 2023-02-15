import { School } from '../generated';
import { Arg, Authorized, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { LimitedQuery, LimitEstimated } from '../complexity';
import { Address } from 'address-rfc2821';
import { validateEmail } from '../validators';

@Resolver((of) => School)
export class ExtendedFieldsSchoolResolver {
    @Query((returns) => School, { nullable: true })
    @Authorized(Role.UNAUTHENTICATED)
    @LimitedQuery()
    async schoolForTeacherEmail(@Arg('teacherEmail') teacherEmail: string) {
        const email = new Address(validateEmail(teacherEmail));

        const school = await prisma.school.findFirst({
            where: {
                emailDomain: email.host,
            },
        });

        return school;
    }
}
