import { Length } from 'class-validator';
import { Mentor } from '../generated';
import { Arg, Authorized, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { Role } from '../authorizations';
import { contactEmailAddress, MentoringCategory } from '../../common/mentoring/categories';
import { getSessionStudent } from '../authentication';
import { DEFAULTSENDERS } from '../../common/mails/config';
import mailjet from '../../common/mails/mailjet';
import { logTransaction } from '../../common/transactionlog/log';
import { GraphQLContext } from '../context';

@InputType()
class MentorContactInput {
    @Field()
    @Length(/* min */ 1, /* max */ 10_000)
    message: string;

    @Field()
    @Length(/* min */ 1, /* max */ 200)
    subject: string;

    @Field((type) => MentoringCategory)
    category: MentoringCategory;
}

@Resolver((of) => Mentor)
export class MutateMentorResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.STUDENT)
    async mentoringContact(@Ctx() context: GraphQLContext, @Arg('data') data: MentorContactInput) {
        const student = await getSessionStudent(context);
        const replyToAddress = student.email;
        const replyToName = `${student.firstname} ${student.lastname}`;
        const receiverAddress = contactEmailAddress(data.category);

        await mailjet.sendPure(data.subject, data.message, DEFAULTSENDERS.noreply, receiverAddress, replyToName, undefined, replyToAddress, replyToName);

        await logTransaction('contactMentor', student, {
            category: data.category,
            subject: data.subject,
            text: data.message,
        });

        return true;
    }
}
