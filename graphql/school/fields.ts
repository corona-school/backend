import { School } from '../generated';
import { Arg, Authorized, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { LimitedQuery } from '../complexity';

@Resolver((of) => School)
export class ExtendedFieldsSchoolResolver {
    @Query((returns) => School, { nullable: true })
    @Authorized(Role.UNAUTHENTICATED)
    @LimitedQuery()
    async schoolForTeacherEmail(@Arg('teacherEmail') teacherEmail: string) {
        const host = teacherEmail.split('@').pop();

        const school = await prisma.school.findFirst({
            where: {
                emailDomain: host,
            },
        });

        return school;
    }
}
