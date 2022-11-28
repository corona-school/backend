import { User } from '../../common/user';
import { Pupil, Student, Screener } from '../generated';
import { ObjectType, Field } from 'type-graphql';

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
    @Field({ nullable: true })
    lastTimeCheckedNotifications?: Date;
}
