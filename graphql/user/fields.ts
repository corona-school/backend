import { Student, Pupil, Screener, Secret } from '../generated';
import { Root, Authorized, Ctx, Field, FieldResolver, ObjectType, Query, Resolver } from 'type-graphql';
import { getSessionPupil, getSessionScreener, getSessionStudent, getSessionUser, GraphQLUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Role } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getSecrets } from '../../common/secret';
import { User } from '../../common/user';

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
    @Authorized(Role.USER, Role.ADMIN)
    firstname(@Root() user: User): string {
        return user.firstname;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.USER, Role.ADMIN)
    lastname(@Root() user: User): string {
        return user.lastname;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.USER, Role.ADMIN)
    email(@Root() user: User): string {
        return user.email;
    }

    @FieldResolver((returns) => Pupil)
    @Authorized(Role.USER, Role.ADMIN)
    async pupil(@Root() user: User): Promise<Pupil> {
        if (!user.pupilId) {
            return null;
        }

        return await prisma.pupil.findUnique({ where: { id: user.pupilId } });
    }

    @FieldResolver((returns) => Student)
    @Authorized(Role.USER, Role.ADMIN)
    async student(@Root() user: User): Promise<Student> {
        if (!user.studentId) {
            return null;
        }

        return await prisma.student.findUnique({ where: { id: user.studentId } });
    }

    @FieldResolver((returns) => Screener)
    @Authorized(Role.USER, Role.ADMIN)
    async screener(@Root() user: User): Promise<Screener> {
        if (!user.screenerId) {
            return null;
        }

        return await prisma.screener.findUnique({ where: { id: user.screenerId } });
    }

    @FieldResolver((returns) => [Secret])
    @Authorized(Role.USER, Role.ADMIN)
    async secrets(@Root() user: User) {
        return await getSecrets(user);
    }
}
