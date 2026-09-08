import { Arg, Authorized, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { Lecture_feedback as LectureFeedback } from '../generated';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { prisma } from '../../common/prisma';
import { GraphQLContext } from '../context';
import { PrerequisiteError } from '../../common/util/error';

@InputType()
class LectureFeedbackSubmitInput implements Partial<LectureFeedback> {
    @Field()
    rating: number;

    @Field(() => [String])
    tags: string[];
}

@Resolver((of) => LectureFeedback)
export class LectureFeedbackMutationsResolver {
    @Mutation((returns) => LectureFeedback)
    @AuthorizedDeferred(Role.OWNER)
    async lectureFeedbackSubmit(@Ctx() context: GraphQLContext, @Arg('id') id: number, @Arg('data') data: LectureFeedbackSubmitInput) {
        const feedback = await prisma.lecture_feedback.findFirst({ where: { id } });
        console.log(feedback);
        await hasAccess(context, 'Lecture_feedback', feedback);

        if (feedback.status === 'submitted') {
            throw new PrerequisiteError('Feedback has already been submitted for this appointment.');
        }

        if (data.rating < 1 || data.rating > 5) {
            throw new PrerequisiteError('Rating must be between 1 and 5.');
        }

        return await prisma.lecture_feedback.update({
            where: { id },
            data: {
                rating: data.rating,
                tags: data.tags,
                status: 'submitted',
            },
        });
    }

    @Mutation((returns) => LectureFeedback)
    @AuthorizedDeferred(Role.OWNER)
    async lectureFeedbackDismiss(@Ctx() context: GraphQLContext, @Arg('id') id: number) {
        const feedback = await prisma.lecture_feedback.findFirst({ where: { id } });
        await hasAccess(context, 'Lecture_feedback', feedback);

        if (feedback.status !== 'pending') {
            throw new PrerequisiteError('Only pending feedback can be dismissed. This feedback has already been reviewed or dismissed.');
        }

        return await prisma.lecture_feedback.update({
            where: { id },
            data: {
                status: 'dismissed',
            },
        });
    }
}
