import { getLogger } from '../logger/logger';
import { getFile, FileID, File } from '../../graphql/files';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { z } from 'zod';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx';
import { course_subject_enum, school_schooltype_enum } from '@prisma/client';
import { encoding_for_model, TiktokenModel } from 'tiktoken';

const logger = getLogger('LessonPlan Generator');

const MODEL_NAME = 'gpt-4o-mini' as TiktokenModel;
const MAX_TOKENS = 128000;

const plan = z.object({
    title: z.string().describe('A concise, descriptive title for the lesson'),
    learningGoal: z.string().describe('Clear, measurable objectives for what students should learn or be able to do by the end of the lesson'),
    agendaExercises: z.string().describe('A detailed timeline of activities and exercises, broken down into segments'),
    assessment: z.string().describe('Methods to evaluate student understanding and achievement of learning goals'),
    homework: z.string().describe('Any assignments or activities for students to complete outside of class'),
    resources: z.string().describe('Materials, equipment, or references needed for the lesson'),
});

const LESSON_PLAN_PROMPT = `Create a lesson plan based on the following structure and requirements:

{requestedFields}

Use the provided materials, requirements, and images (if any) to create a cohesive and engaging lesson plan. Ensure that all components are aligned with the subject, grade level, duration specified, and school type.`;

interface GenerateLessonPlanInput {
    fileUuids: FileID[];
    subject: course_subject_enum;
    grade: number;
    duration: number;
    state: string;
    prompt: string;
    expectedOutputs?: string[];
    schoolType: school_schooltype_enum;
}

// Function to count tokens
function countTokens(text: string, model: TiktokenModel): number {
    const enc = encoding_for_model(model);
    const tokens = enc.encode(text);
    enc.free();
    return tokens.length;
}

// Function to truncate text to fit within token limit
function truncateText(text: string, model: TiktokenModel, maxTokens: number): string {
    const enc = encoding_for_model(model);
    const tokens = enc.encode(text);
    if (tokens.length <= maxTokens) {
        enc.free();
        return text;
    }
    const truncatedTokens = tokens.slice(0, maxTokens);
    const truncatedText = new TextDecoder().decode(enc.decode(truncatedTokens));
    enc.free();
    return truncatedText;
}

export async function generateLessonPlan({
    fileUuids,
    subject,
    grade,
    duration,
    state,
    prompt,
    expectedOutputs,
    schoolType,
}: GenerateLessonPlanInput): Promise<Partial<z.infer<typeof plan>> & { subject: course_subject_enum; grade: string; duration: number }> {
    logger.info(`Generating lesson plan for subject: ${subject}, grade: ${grade}, duration: ${duration} minutes, school type: ${schoolType}`);

    const emptyFiles: string[] = [];
    let combinedContent = '';
    let imageContents: { type: 'image_url'; image_url: { url: string } }[] = [];

    if (fileUuids.length > 0) {
        // Fetch file contents for each UUID
        const allFiles = await Promise.all(
            fileUuids.map(async (uuid) => {
                try {
                    const file: File = getFile(uuid);
                    const blob = new Blob([file.buffer], { type: file.mimetype });

                    if (file.mimetype.startsWith('image/')) {
                        // Handle image files
                        const base64 = Buffer.from(file.buffer).toString('base64');
                        imageContents.push({
                            type: 'image_url',
                            image_url: {
                                url: `data:${file.mimetype};base64,${base64}`,
                            },
                        });
                        return null;
                    }

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
                        docs
                            .map((doc, index) => (file.mimetype === 'application/pdf' ? `Page ${index + 1}:\n${doc.pageContent}` : doc.pageContent))
                            .join('\n\n');

                    // Check if the content is empty (excluding filename and page numbers)
                    const contentWithoutMetadata = content
                        .replace(`Filename: ${file.originalname}\n\n`, '')
                        .replace(/Page \d+:\n/g, '')
                        .trim();
                    if (contentWithoutMetadata.length === 0) {
                        emptyFiles.push(file.originalname);
                        return null;
                    }

                    return {
                        name: file.originalname,
                        content: content,
                        type: file.mimetype,
                    };
                } catch (error) {
                    logger.error(`Error fetching or parsing file with UUID ${uuid}: ${error.message}`);
                    throw error;
                }
            })
        );

        const validFiles = allFiles.filter((file): file is NonNullable<typeof file> => file !== null);

        if (emptyFiles.length > 0) {
            throw new Error(`The following files are empty or their content could not be processed: ${emptyFiles.join(', ')}`);
        }

        // Combine all file contents
        combinedContent = validFiles.map((file) => file.content).join('\n\n');
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.');
    }

    // Initialize the ChatOpenAI model
    const model = new ChatOpenAI({
        modelName: MODEL_NAME,
        temperature: 0,
    });

    // Create a new plan schema based on expected outputs
    const dynamicPlan = z.object(Object.fromEntries(Object.entries(plan.shape).filter(([key]) => !expectedOutputs || expectedOutputs.includes(key))));

    const structuredLlm = model.withStructuredOutput(dynamicPlan);

    try {
        logger.info('Generating lesson plan...');
        const requestedFields =
            expectedOutputs && expectedOutputs.length > 0
                ? expectedOutputs.map((field) => `${field}: {${field}}`).join('\n')
                : Object.keys(plan.shape)
                      .map((field) => `${field}: {${field}}`)
                      .join('\n');

        let finalPrompt = `${LESSON_PLAN_PROMPT.replace(
            '{requestedFields}',
            requestedFields
        )}\n\nCreate a lesson plan for ${subject} students in grade ${grade} in the state ${state}, for a ${schoolType} school. The lesson should last ${duration} minutes. ${prompt}`;

        if (combinedContent) {
            finalPrompt += `\n\nInclude relevant content from the provided materials:\n${combinedContent}`;
        }

        // Only count tokens if the character count exceeds MAX_TOKENS
        if (finalPrompt.length > MAX_TOKENS) {
            const tokenCount = countTokens(finalPrompt, MODEL_NAME);
            if (tokenCount > MAX_TOKENS) {
                logger.warn(`Prompt exceeds token limit. Prompt has ${tokenCount} tokens but the maximum allowed is ${MAX_TOKENS} tokens. Truncating...`);
                const truncatedContent = truncateText(
                    combinedContent,
                    MODEL_NAME,
                    MAX_TOKENS - countTokens(finalPrompt.replace(combinedContent, ''), MODEL_NAME)
                );
                finalPrompt = finalPrompt.replace(combinedContent, truncatedContent);
            }
            logger.debug(`Prompt token count: ${countTokens(finalPrompt, MODEL_NAME)}`);
        }

        logger.debug(`Final prompt: ${finalPrompt}`);

        // Prepare the message content
        const messageContent: ({ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } })[] = [
            { type: 'text', text: finalPrompt },
            ...imageContents,
        ];

        // Create the human message
        const message = new HumanMessage({
            content: messageContent,
        });

        // Invoke the model
        const result = await structuredLlm.invoke([message]);

        return {
            ...result,
            subject,
            grade: grade.toString(),
            duration,
        };
    } catch (error) {
        logger.error(`Error generating lesson plan: ${error.message}`);
        throw error;
    }
}
