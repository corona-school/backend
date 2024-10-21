import { Resolver, Mutation, Arg, Authorized, Ctx, InputType, Field, Int, ObjectType, registerEnumType } from 'type-graphql';
import { Role } from '../authorizations';
import { GraphQLContext } from '../context';
import { getLogger } from '../../common/logger/logger';
import { generateLessonPlan } from '../../common/lessonplan/generate';
import { course_subject_enum } from '@prisma/client';
import { ApolloError, UserInputError } from 'apollo-server-express';

const logger = getLogger(`LessonPlan Mutations`);

// Register the course_subject_enum as a GraphQL enum
registerEnumType(course_subject_enum, {
    name: 'CourseSubjectEnum',
    description: 'The subject of the course',
});

// Create a new enum for expected output fields
enum LessonPlanField {
    TITLE = 'title',
    LEARNING_GOAL = 'learningGoal',
    AGENDA_EXERCISES = 'agendaExercises',
    ASSESSMENT = 'assessment',
    HOMEWORK = 'homework',
    RESOURCES = 'resources',
}

// Register the LessonPlanField enum
registerEnumType(LessonPlanField, {
    name: 'LessonPlanField',
    description: 'Fields that can be generated for a lesson plan',
});

@InputType()
class GenerateLessonPlanInput {
    @Field(() => [String], { nullable: true })
    fileUuids?: string[];

    @Field(() => course_subject_enum)
    subject: course_subject_enum;

    @Field(() => Int)
    grade: number;

    @Field(() => Int)
    duration: number;

    @Field(() => String)
    prompt: string;

    @Field(() => [LessonPlanField], { nullable: true })
    expectedOutputs?: LessonPlanField[];
}

@ObjectType()
class LessonPlanOutput {
    @Field(() => String, { nullable: true })
    title?: string;

    @Field(() => course_subject_enum)
    subject: course_subject_enum;

    @Field(() => String)
    grade: string;

    @Field(() => Int)
    duration: number;

    @Field(() => String, { nullable: true })
    learningGoal?: string;

    @Field(() => String, { nullable: true })
    agendaExercises?: string;

    @Field(() => String, { nullable: true })
    assessment?: string;

    @Field(() => String, { nullable: true })
    homework?: string;

    @Field(() => String, { nullable: true })
    resources?: string;
}

class LessonPlanGenerationError extends ApolloError {
    constructor(message: string) {
        super(message, 'LESSON_PLAN_GENERATION_ERROR');

        Object.defineProperty(this, 'name', { value: 'LessonPlanGenerationError' });
    }
}

@Resolver()
export class MutateLessonPlanResolver {
    @Mutation(() => LessonPlanOutput)
    @Authorized(Role.INSTRUCTOR, Role.ADMIN)
    async generateLessonPlan(@Ctx() context: GraphQLContext, @Arg('data') data: GenerateLessonPlanInput): Promise<LessonPlanOutput> {
        const { fileUuids, subject, grade, duration, prompt, expectedOutputs } = data;

        try {
            const generatedLessonPlan = await generateLessonPlan({
                fileUuids: fileUuids || [],
                subject,
                grade,
                duration,
                prompt,
                expectedOutputs: expectedOutputs?.map((field) => field.toString()),
            });
            logger.info(`Generated lesson plan for subject: ${subject}, grade: ${grade}`);

            // Create the lesson plan output based on the expected outputs
            const lessonPlan: LessonPlanOutput = {
                subject: generatedLessonPlan.subject,
                grade: generatedLessonPlan.grade,
                duration: generatedLessonPlan.duration,
            };

            // Only include the fields that were requested or generated
            if (expectedOutputs) {
                for (const field of expectedOutputs) {
                    if (field in generatedLessonPlan) {
                        lessonPlan[field] = generatedLessonPlan[field];
                    }
                }
            } else {
                // If no expected outputs were specified, include all generated fields
                Object.assign(lessonPlan, generatedLessonPlan);
            }

            return lessonPlan;
        } catch (error) {
            logger.error(`Error generating lesson plan: ${error.message}`);

            if (error.message.includes('Invalid fileID')) {
                throw new UserInputError('Invalid file UUID provided', {
                    invalidFileUUID: error.message.match(/Invalid fileID\((.*?)\)/)[1],
                });
            } else if (error.message.includes('Failed to process one or more files')) {
                throw new LessonPlanGenerationError('Failed to process one or more files. Please check the provided file UUIDs and try again.');
            } else if (error.message.includes('OpenAI API key is not set')) {
                throw new LessonPlanGenerationError('Internal server error: OpenAI API key is not configured.');
            } else if (error.message.includes('The following files are empty or their content could not be processed:')) {
                throw new LessonPlanGenerationError(error.message);
            } else {
                throw new LessonPlanGenerationError('An unexpected error occurred while generating the lesson plan. Please try again later.');
            }
        }
    }
}
