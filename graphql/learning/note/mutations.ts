import { Arg, Authorized, Ctx, Field, FieldResolver, InputType, Mutation, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote, Learning_topic as LearningTopic, learning_note_type } from '../../generated';
import { AuthorizedDeferred, Role, hasAccess } from '../../authorizations';
import { prisma } from '../../../common/prisma';
import { LearningNoteCreate, createNote, setNoteType } from '../../../common/learning/notes';
import { GraphQLInt } from 'graphql';
import { GraphQLContext } from '../../context';
import { PrerequisiteError } from '../../../common/util/error';
import { getAssignment, getNote, getTopic } from '../../../common/learning/util';
import { RateLimit } from '../../rate-limit';

@InputType()
class LearningNoteCreateInput implements LearningNoteCreate {
    @Field(() => GraphQLInt, { nullable: true })
    assignmentId?: number;
    @Field(() => GraphQLInt, { nullable: true })
    topicId?: number;
    @Field(() => GraphQLInt, { nullable: true })
    replyToId?: number;
    @Field()
    text: string;
    @Field(() => learning_note_type)
    type: learning_note_type;
}

@Resolver((of) => LearningTopic)
export class LearningNoteMutationsResolver {
    @Mutation((returns) => LearningNote)
    @AuthorizedDeferred(Role.OWNER, Role.ADMIN)
    @RateLimit('Learning Note Creation', 200, /* per */ 60 * 60 * 1000 /* = 1 hour */)
    // eslint-disable-next-line lernfair-lint/graphql-deferred-auth
    async learningNoteCreate(@Ctx() context: GraphQLContext, @Arg('note') note: LearningNoteCreateInput) {
        if (note.topicId) {
            const topic = await getTopic(note.topicId);
            await hasAccess(context, 'Learning_topic', topic);
        } else if (note.assignmentId) {
            const assignment = await getAssignment(note.assignmentId);
            await hasAccess(context, 'Learning_assignment', assignment);
        } else {
            throw new PrerequisiteError(`Note must be part of an assignment or topic`);
        }

        return await createNote(context.user, note);
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.OWNER, Role.ADMIN)
    async learningNoteChangeType(@Ctx() context: GraphQLContext, @Arg('noteId', () => GraphQLInt) noteId: number, @Arg('type') type: learning_note_type) {
        const note = await getNote(noteId);
        await hasAccess(context, 'Learning_note', note);

        await setNoteType(context.user, note, type);
        return true;
    }
}
