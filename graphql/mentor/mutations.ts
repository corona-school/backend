import { Length } from 'class-validator';
import { Mentor } from '../generated';
import { Arg, Authorized, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { Role } from '../authorizations';
import { contactEmailAddress, MentoringCategory } from '../../common/mentoring/categories';
import { getSessionPupil, getSessionStudent, isSessionPupil, isSessionStudent } from '../authentication';
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
    @Authorized(Role.USER)
    async mentoringContact(@Ctx() context: GraphQLContext, @Arg('data') data: MentorContactInput) {
        const replyToAddress = context.user!.email;
        const replyToName = `${context.user!.firstname} ${context.user!.lastname}`;
        const receiverAddress = contactEmailAddress(data.category);

        await mailjet.sendPure(data.subject, data.message, DEFAULTSENDERS.noreply, receiverAddress, replyToName, undefined, replyToAddress, replyToName);

        if (isSessionStudent(context)) {
            const student = await getSessionStudent(context);
            await logTransaction('contactMentor', student, {
                category: data.category,
                subject: data.subject,
                text: data.message,
            });
        } else if (isSessionPupil(context)) {
            const pupil = await getSessionPupil(context);
            await logTransaction('contactMentor', pupil, {
                category: data.category,
                subject: data.subject,
                text: data.message,
            });
        }

        return true;
    }
}
