import { Resolver, Mutation, Arg, Authorized, Ctx, InputType, Field, Int } from 'type-graphql';
import { Role } from '../authorizations';
import { GraphQLContext } from '../context';
import { Subject } from '../types/subject';
import { getLogger } from '../../common/logger/logger';
import { generateLessonPlan } from '../../common/lessonplan/generate';

const logger = getLogger(`LessonPlan Mutations`);

@InputType()
class GenerateLessonPlanInput {
    @Field(() => [String])
    fileUuids: string[];

    @Field(() => String)
    subject: string;

    @Field(() => Int)
    grade: number;

    @Field(() => Int)
    duration: number;

    @Field(() => [String])
    outputRequirements: string[];
}

@Resolver()
export class MutateLessonPlanResolver {
    @Mutation(() => String)
    @Authorized(Role.INSTRUCTOR, Role.ADMIN)
    async generateLessonPlan(@Ctx() context: GraphQLContext, @Arg('data') data: GenerateLessonPlanInput): Promise<string> {
        const { fileUuids, subject, grade, duration, outputRequirements } = data;

        try {
            const lessonPlan = await generateLessonPlan(fileUuids, subject, grade, duration, outputRequirements);
            logger.info(`Generated lesson plan for subject: ${subject}, grade: ${grade}`);
            return lessonPlan;
        } catch (error) {
            logger.error(`Error generating lesson plan: ${error.message}`);
            throw new Error('Failed to generate lesson plan');
        }
    }
}
