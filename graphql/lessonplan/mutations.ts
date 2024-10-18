import { Resolver, Mutation, Arg, Authorized, Ctx, InputType, Field, Int, ObjectType, registerEnumType } from 'type-graphql';
import { Role } from '../authorizations';
import { GraphQLContext } from '../context';
import { getLogger } from '../../common/logger/logger';
import { generateLessonPlan } from '../../common/lessonplan/generate';
import { course_subject_enum } from '@prisma/client';

const logger = getLogger(`LessonPlan Mutations`);

// Register the course_subject_enum as a GraphQL enum
registerEnumType(course_subject_enum, {
    name: 'CourseSubjectEnum',
    description: 'The subject of the course',
});

@InputType()
class GenerateLessonPlanInput {
    @Field(() => [String])
    fileUuids: string[];

    @Field(() => course_subject_enum)
    subject: course_subject_enum;

    @Field(() => Int)
    grade: number;

    @Field(() => Int)
    duration: number;

    @Field(() => String)
    prompt: string;
}

@ObjectType()
class LessonPlanOutput {
    @Field(() => Int)
    id?: number;

    @Field(() => Date)
    createdAt?: Date;

    @Field(() => Date)
    updatedAt?: Date;

    @Field(() => String)
    title?: string;

    @Field(() => course_subject_enum)
    subject?: course_subject_enum;

    @Field(() => String)
    grade?: string;

    @Field(() => Int)
    duration?: number;

    @Field(() => String)
    basicKnowledge?: string;

    @Field(() => String)
    learningGoal?: string;

    @Field(() => String)
    agendaExercises?: string;

    @Field(() => String)
    assessment?: string;

    @Field(() => String)
    homework?: string;

    @Field(() => String)
    resources?: string;

    @Field(() => Date)
    startDate?: Date;

    @Field(() => Date)
    endDate?: Date;
}

@Resolver()
export class MutateLessonPlanResolver {
    @Mutation(() => LessonPlanOutput)
    @Authorized(Role.INSTRUCTOR, Role.ADMIN)
    async generateLessonPlan(@Ctx() context: GraphQLContext, @Arg('data') data: GenerateLessonPlanInput): Promise<LessonPlanOutput> {
        const { fileUuids, subject, grade, duration, prompt } = data;

        try {
            const generatedLessonPlan = await generateLessonPlan(fileUuids, subject, grade, duration, prompt);
            logger.info(`Generated lesson plan for subject: ${subject}, grade: ${grade}`);

            // TODO: Implement the actual creation of the lesson plan in the database
            // For now, we'll use a mock ID and dates
            const now = new Date();
            const lessonPlan: LessonPlanOutput = {
                id: 1, // This should be replaced with an actual database-generated ID
                createdAt: now,
                updatedAt: now,
                startDate: now,
                endDate: new Date(now.getTime() + duration * 60000), // Set end date based on duration
                title: generatedLessonPlan.title || 'Untitled Lesson Plan',
                subject: subject,
                grade: grade.toString(),
                duration: duration,
                basicKnowledge: generatedLessonPlan.basicKnowledge || '',
                learningGoal: generatedLessonPlan.learningGoal || '',
                agendaExercises: generatedLessonPlan.agendaExercises || '',
                assessment: generatedLessonPlan.assessment || '',
                homework: generatedLessonPlan.homework || '',
                resources: generatedLessonPlan.resources || '',
            };

            return lessonPlan;
        } catch (error) {
            logger.error(`Error generating lesson plan: ${error.message}`);
            throw new Error('Failed to generate lesson plan: ' + error.message);
        }
    }
}
