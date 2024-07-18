import { Arg, Authorized, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import {
    Learning_assignment as LearningAssignment,
    Learning_note as LearningNote,
    Learning_topic as LearningTopic,
    course_subject_enum as Subject,
} from '../../generated';
import { AuthorizedDeferred, Role, hasAccess } from '../../authorizations';
import { prisma } from '../../../common/prisma';
import { GraphQLInt } from 'graphql';
import { GraphQLContext } from '../../context';
import { getSessionStudent } from '../../authentication';
import { getLogger } from '../../../common/logger/logger';
import { PrerequisiteError } from '../../../common/util/error';

const logger = getLogger('LearningTopic');

@Resolver((of) => LearningTopic)
export class LearningTopicMutationsResolver {
    @Mutation((returns) => LearningTopic)
    @AuthorizedDeferred(Role.OWNER)
    async learningTopicCreate(
        @Ctx() context: GraphQLContext,
        @Arg('matchId', () => GraphQLInt) matchId: number,
        @Arg('name') name: string,
        @Arg('subject') subject: Subject
    ) {
        const student = await getSessionStudent(context);
        const match = await prisma.match.findUniqueOrThrow({ where: { id: matchId } });
        await hasAccess(context, 'Match', match);

        if (match.dissolved) {
            throw new PrerequisiteError(`Match was already dissolved`);
        }

        const result = await prisma.learning_topic.create({
            data: {
                name,
                subject,
                matchId: match.id,
                pupilId: match.pupilId,
            },
        });

        logger.info(`Student(${student.id}) created LearningTopic(${result.id}) for Pupil(${match.pupilId})`);
        return result;
    }
}
