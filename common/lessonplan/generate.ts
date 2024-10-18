import { getLogger } from '../logger/logger';
import { getFile, FileID, File } from '../../graphql/files';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx';
import { course_subject_enum } from '@prisma/client';

const logger = getLogger('LessonPlan Generator');

const plan = z.object({
    title: z.string().describe('A concise, descriptive title for the lesson'),
    basicKnowledge: z.string().describe('Prerequisite knowledge or skills students should have before the lesson'),
    learningGoal: z.string().describe('Clear, measurable objectives for what students should learn or be able to do by the end of the lesson'),
    agendaExercises: z.string().describe('A detailed timeline of activities and exercises, broken down into segments'),
    assessment: z.string().describe('Methods to evaluate student understanding and achievement of learning goals'),
    homework: z.string().describe('Any assignments or activities for students to complete outside of class'),
    resources: z.string().describe('Materials, equipment, or references needed for the lesson'),
});

const LESSON_PLAN_PROMPT = `Create a lesson plan based on the following structure and requirements:

1. Title: {title}
2. Basic Knowledge: {basicKnowledge}
3. Learning Goal: {learningGoal}
4. Agenda and Exercises: {agendaExercises}
5. Assessment: {assessment}
6. Homework: {homework}
7. Resources: {resources}

Use the provided materials and requirements to create a cohesive and engaging lesson plan. Ensure that all components are aligned with the subject, grade level, and duration specified.`;

export async function generateLessonPlan(
    fileUuids: FileID[],
    subject: course_subject_enum,
    grade: number,
    duration: number,
    prompt: string
): Promise<z.infer<typeof plan> & { subject: course_subject_enum; grade: string; duration: number }> {
    logger.info(`Generating lesson plan for subject: ${subject}, grade: ${grade}, duration: ${duration} minutes`);

    // Fetch file contents for each UUID
    const files = await Promise.all(
        fileUuids.map(async (uuid) => {
            try {
                const file: File = getFile(uuid);
                const blob = new Blob([file.buffer], { type: file.mimetype });
                let loader;
                let docs;

                if (file.mimetype === 'application/pdf') {
                    loader = new PDFLoader(blob, { splitPages: true });
                    docs = await loader.load();
                } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    loader = new DocxLoader(blob);
                    docs = await loader.load();
                } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                    loader = new PPTXLoader(blob);
                    docs = await loader.load();
                } else {
                    throw new Error(`Unsupported file type: ${file.mimetype}`);
                }

                // Add filename and page numbers (only for PDFs) to the content
                const content =
                    `Filename: ${file.originalname}\n\n` +
                    docs.map((doc, index) => (file.mimetype === 'application/pdf' ? `Page ${index + 1}:\n${doc.pageContent}` : doc.pageContent)).join('\n\n');

                return {
                    name: file.originalname,
                    content: content,
                    type: file.mimetype,
                };
            } catch (error) {
                logger.error(`Error fetching or parsing file with UUID ${uuid}: ${error.message}`);
                throw new Error('Failed to process one or more files');
            }
        })
    );

    const validFiles = files.filter((file): file is NonNullable<typeof file> => file !== null);

    // Combine all file contents
    const combinedContent = validFiles.map((file) => file.content).join('\n\n');

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.');
    }

    // Initialize the ChatOpenAI model
    const model = new ChatOpenAI({
        modelName: 'gpt-4o-mini',
        temperature: 0,
    });

    const structuredLlm = model.withStructuredOutput(plan);

    try {
        logger.info('Generating lesson plan...');
        const finalPrompt = `${LESSON_PLAN_PROMPT}\n\nCreate a lesson plan for ${subject} students in grade ${grade}. The lesson should last ${duration} minutes. Include relevant content from the provided materials and follow these additional instructions: ${prompt}\n\nProvided materials:\n${combinedContent}`;
        logger.debug(`Prompt: ${finalPrompt}`);
        const result = await structuredLlm.invoke(finalPrompt);

        return {
            ...result,
            subject,
            grade: grade.toString(),
            duration,
        };
    } catch (error) {
        logger.error(`Error generating lesson plan: ${error.message}`);
        throw new Error('Failed to generate lesson plan');
    }
}
