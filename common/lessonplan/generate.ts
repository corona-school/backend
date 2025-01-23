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
import sharp from 'sharp';
import { PrerequisiteError } from '../util/error';
// import { promises as fs } from 'fs';
// import * as path from 'path';
// import { v4 as uuidv4 } from 'uuid';

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

Use the provided materials, requirements, and images (if any) to create a cohesive and engaging lesson plan. Ensure that all components are aligned with the subject, grade level, duration specified, and school type.

IMPORTANT: 
- Respond in {language}. 
- All content of the lesson plan should be in {language}.
- Format each section with clear line breaks (\n) between key points.
- Use a structured format with line breaks to improve readability.
- Ensure each section is clearly separated and easy to read.`;

interface GenerateLessonPlanInput {
    fileUuids: FileID[];
    subject: course_subject_enum;
    grade: number;
    duration: number;
    state: string;
    prompt: string;
    expectedOutputs?: string[];
    schoolType: school_schooltype_enum;
    language?: string;
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

// Function to resize image based on aspect ratio
async function resizeImage(buffer: Buffer): Promise<Buffer> {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    if (!width || !height) {
        throw new Error('Unable to determine image dimensions');
    }

    logger.debug(`Original image dimensions: ${width}x${height}`);

    const tileSize = 512;
    const aspectRatio = width / height;

    logger.debug(`Image aspect ratio: ${aspectRatio}`);

    let tilesX, tilesY;
    if (aspectRatio > 1.1) {
        // Landscape image
        tilesX = 2;
        tilesY = 1;
        logger.debug(`Landscape image. Tiles: ${tilesX}x${tilesY}`);
    } else if (aspectRatio < 0.9) {
        // Portrait image
        tilesX = 1;
        tilesY = 2;
        logger.debug(`Portrait image. Tiles: ${tilesX}x${tilesY}`);
    } else {
        // Square image
        tilesX = tilesY = 1;
        logger.debug(`Square image. Tiles: ${tilesX}x${tilesY}`);
    }

    const newWidth = tilesX * tileSize;
    const newHeight = tilesY * tileSize;

    logger.debug(`New image dimensions: ${newWidth}x${newHeight}`);
    logger.debug(`Total tiles used: ${tilesX * tilesY}`);

    return image.resize(newWidth, newHeight, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).toBuffer();
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
    language = 'German', // Default language is German
}: GenerateLessonPlanInput): Promise<Partial<z.infer<typeof plan>> & { subject: course_subject_enum; grade: string; duration: number }> {
    logger.info(`Generating lesson plan for subject: ${subject}, grade: ${grade}, duration: ${duration} minutes, school type: ${schoolType}`);

    const emptyFiles: string[] = [];
    let combinedContent = '';
    const imageContents: { type: 'image_url'; image_url: { url: string } }[] = [];

    if (fileUuids.length > 0) {
        // Fetch file contents for each UUID
        const allFiles = await Promise.all(
            fileUuids.map(async (uuid) => {
                try {
                    const file: File = getFile(uuid);
                    const blob = new Blob([file.buffer], { type: file.mimetype });

                    if (file.mimetype.startsWith('image/')) {
                        // Handle image files
                        logger.debug(`Processing image file: ${file.originalname}`);
                        const resizedBuffer = await resizeImage(file.buffer);
                        const base64 = resizedBuffer.toString('base64');
                        const dataUrl = `data:${file.mimetype};base64,${base64}`;
                        imageContents.push({
                            type: 'image_url',
                            image_url: {
                                url: dataUrl,
                            },
                        });

                        // // Generate a unique filename
                        // const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
                        // const savePath = path.join('./', uniqueFilename);

                        // // Write the resized image to a file
                        // await fs.writeFile(savePath, resizedBuffer);

                        logger.debug(`Image processed and converted to base64`);
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
                        throw new PrerequisiteError(`Unsupported file type: ${file.mimetype}`);
                    }

                    // Add filename and page numbers (only for PDFs) to the content
                    const content =
                        `Filename: ${file.originalname}\n\n` +
                        docs
                            .map((doc, index) => (file.mimetype === 'application/pdf' ? `Page ${index + 1}:\n${doc.pageContent}` : doc.pageContent))
                            .join('\n\n');

                    if (!docs.some((doc) => doc.pageContent && doc.pageContent.trim().length > 0)) {
                        throw new PrerequisiteError(`The file ${file.originalname} is empty or its content could not be processed.`);
                    }

                    return {
                        name: file.originalname,
                        content: content,
                        type: file.mimetype,
                    };
                } catch (error) {
                    throw new PrerequisiteError(`Error fetching or parsing file with UUID ${uuid}: ${error.message}`);
                }
            })
        );

        const validFiles = allFiles.filter((file): file is NonNullable<typeof file> => file !== null);

        if (emptyFiles.length > 0) {
            throw new PrerequisiteError(`The following files are empty or their content could not be processed: ${emptyFiles.join(', ')}`);
        }

        // Combine all file contents
        combinedContent = validFiles.map((file) => file.content).join('\n\n');
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
        throw new PrerequisiteError('OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.');
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
        logger.info('Generating lesson plan...', { dynamicPlan, prompt, subject, grade, duration, state, schoolType });
        const requestedFields = Object.keys(dynamicPlan.shape)
            .map((field) => `${field}: {${field}}`)
            .join('\n');

        let finalPrompt = `${LESSON_PLAN_PROMPT.replace('{requestedFields}', requestedFields).replace(
            '{language}',
            language
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
        throw new Error(`Unexpected error while generating lesson plan: ${error.message}`);
    }
}
