import { Resolver, Mutation, Arg, Authorized, Ctx, InputType, Field, Int, ObjectType, registerEnumType } from 'type-graphql';
import { MaxLength, ArrayMaxSize } from 'class-validator';
import { Role } from '../authorizations';
import { GraphQLContext } from '../context';
import { getLogger } from '../../common/logger/logger';
import { generateLessonPlan } from '../../common/lessonplan/generate';
import { course_subject_enum, pupil_state_enum, school_schooltype_enum } from '@prisma/client';
import { PrerequisiteError, ClientError } from '../../common/util/error';
import { getStateFullName } from '../../common/util/stateMappings';

const logger = getLogger(`LessonPlan Mutations`);

// Maximum prompt length (in characters)
const MAX_PROMPT_LENGTH = 10000;

// Maximum number of files
const MAX_FILES = 10;

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
    @ArrayMaxSize(MAX_FILES, { message: `Number of files must not exceed ${MAX_FILES}` })
    fileUuids?: string[];

    @Field(() => course_subject_enum)
    subject: course_subject_enum;

    @Field(() => Int)
    grade: number;

    @Field(() => Int)
    duration: number;

    @Field(() => pupil_state_enum)
    state: pupil_state_enum;

    @Field(() => String)
    @MaxLength(MAX_PROMPT_LENGTH, { message: `Prompt must not exceed ${MAX_PROMPT_LENGTH} characters` })
    prompt: string;

    @Field(() => [LessonPlanField], { nullable: true })
    expectedOutputs?: LessonPlanField[];

    @Field(() => school_schooltype_enum)
    schoolType: school_schooltype_enum;

    @Field(() => String, { nullable: true, defaultValue: 'German' })
    language?: string;
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

@Resolver()
export class MutateLessonPlanResolver {
    @Mutation(() => LessonPlanOutput)
    @Authorized(Role.INSTRUCTOR, Role.ADMIN)
    async generateLessonPlan(@Ctx() context: GraphQLContext, @Arg('data') data: GenerateLessonPlanInput): Promise<LessonPlanOutput> {
        const { fileUuids, subject, grade, duration, state, prompt, expectedOutputs, schoolType, language } = data;

        const fullStateName: string = getStateFullName(state);

        try {
            const generatedLessonPlan = await generateLessonPlan({
                fileUuids: fileUuids || [],
                subject,
                grade,
                duration,
                state: fullStateName,
                prompt,
                expectedOutputs: expectedOutputs?.map((field) => field.toString()),
                schoolType,
                language,
            });
            logger.info(`Generated lesson plan for subject: ${subject}, grade: ${grade}, school type: ${schoolType}, language: ${language || 'German'}`);

            // Create the lesson plan output based on the expected outputs
            const lessonPlan: LessonPlanOutput = {
                subject: generatedLessonPlan.subject,
                grade: generatedLessonPlan.grade,
                duration: generatedLessonPlan.duration,
            };

            // If no expected outputs were specified, include all generated fields
            Object.assign(lessonPlan, generatedLessonPlan);

            return lessonPlan;
        } catch (error) {
            if (error instanceof ClientError) {
                throw error;
            }
            logger.error(`Unexpected error while generating lesson plan: ${error.message}`);
            throw new PrerequisiteError('An unexpected error occurred while generating the lesson plan. Please try again later.');
        }
    }
}
