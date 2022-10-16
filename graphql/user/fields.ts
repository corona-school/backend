import { Student, Pupil, Screener, Secret, PupilWhereInput, StudentWhereInput } from '../generated';
import { Root, Authorized, Ctx, Field, FieldResolver, ObjectType, Query, Resolver, Arg } from 'type-graphql';
import { getSessionPupil, getSessionScreener, getSessionStudent, getSessionUser, GraphQLUser, loginAsUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Role } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getSecrets } from '../../common/secret';
import { User, userForPupil, userForStudent } from '../../common/user';
import { ACCUMULATED_LIMIT, LimitEstimated } from '../complexity';

@ObjectType()
export class UserType implements User {
    @Field()
    userID: string;

    @Field()
    firstname: string;
    @Field()
    lastname: string;
    @Field()
    email: string;

    @Field({ nullable: true })
    pupil?: Pupil;
    @Field({ nullable: true })
    student?: Student;
    @Field({ nullable: true })
    screener?: Screener;
}

@Resolver((of) => UserType)
export class UserFieldsResolver {
    @FieldResolver((returns) => String)
    @Authorized(Role.OWNER, Role.ADMIN)
    firstname(@Root() user: User): string {
        return user.firstname;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.OWNER, Role.ADMIN)
    lastname(@Root() user: User): string {
        return user.lastname;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.OWNER, Role.ADMIN)
    email(@Root() user: User): string {
        return user.email;
    }

    @FieldResolver((returns) => Pupil)
    @Authorized(Role.OWNER, Role.ADMIN)
    async pupil(@Root() user: User): Promise<Pupil> {
        if (!user.pupilId) {
            return null;
        }

        return await prisma.pupil.findUnique({ where: { id: user.pupilId } });
    }

    @FieldResolver((returns) => Student)
    @Authorized(Role.OWNER, Role.ADMIN)
    async student(@Root() user: User): Promise<Student> {
        if (!user.studentId) {
            return null;
        }

        return await prisma.student.findUnique({ where: { id: user.studentId } });
    }

    @FieldResolver((returns) => Screener)
    @Authorized(Role.OWNER, Role.ADMIN)
    async screener(@Root() user: User): Promise<Screener> {
        if (!user.screenerId) {
            return null;
        }

        return await prisma.screener.findUnique({ where: { id: user.screenerId } });
    }

    @FieldResolver((returns) => [Secret])
    @Authorized(Role.OWNER, Role.ADMIN)
    async secrets(@Root() user: User) {
        return await getSecrets(user);
    }

    @FieldResolver((returns) => [String])
    @Authorized(Role.ADMIN)
    async roles(@Root() user: User) {
        const fakeContext: GraphQLContext = { ip: '?', prisma, sessionToken: 'fake' };
        await loginAsUser(user, fakeContext);
        return fakeContext.user.roles;
    }

    // During mail campaigns we need to retrieve a potentially large amount of users
    // This endpoint has no restriction in the number of users returned,
    //  and should thus be used with care
    @Query((returns) => [UserType])
    @Authorized(Role.ADMIN)
    @LimitEstimated(ACCUMULATED_LIMIT) // no subqueries allowed
    async usersForCampaign(
        @Arg('pupilQuery', { nullable: true }) pupilQuery?: PupilWhereInput,
        @Arg('studentQuery', { nullable: true }) studentQuery?: StudentWhereInput
    ) {
        const result: User[] = [];

        if (pupilQuery) {
            // Make sure only active users with verified email are returned
            const pupils = await prisma.student.findMany({
                select: { firstname: true, lastname: true, email: true, id: true },
                where: { ...pupilQuery, active: true, verification: null },
            });
            result.push(...pupils.map(userForPupil));
        }

        if (studentQuery) {
            const students = await prisma.pupil.findMany({
                select: { firstname: true, lastname: true, email: true, id: true },
                where: { ...studentQuery, active: true, verification: null },
            });
            result.push(...students.map(userForStudent));
        }

        return result;
    }
}
