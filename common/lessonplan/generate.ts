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
    agendaExercises: z.string().describe('Only provide a high level structure, dont provide any details, this should just be a short paragraph. Use bullet points with short text lines instead of a longer text. Struktur mit 3 Teilen: Teil 1 “Ankommen und Einstieg” Der Anfang der Stunde ist entscheidend, um Kontakt aufzubauen, die Beziehung zu stärken und eine angenehme Lernatmosphäre zu schaffen. Beispiele für den Einstieg: Stellt beide eure aktuelle Stimmung als Emoji dar und sprecht kurz darüber oder Check-In-Frage, z.B.: „Wenn du ein Tier/Wetter/Gebäude/… wärst, welches wärst du heute? oder Besprich mit deinem/r Lernpartner:in die Möglichkeiten, eine ruhige Lernumgebung herzustellen, z.B. Tür schließen, Tisch aufräumen, Materialien, Hausaufgabenheft und Schreibzeug bereitlegen. Kann 2-5 Minuten dauern. Teil 2 “Hauptteil”: Der Hauptteil ist der Kern der Nachhilfestunde. Es gibt kein „richtig“ oder „falsch“, sondern er sollte an die Bedürfnisse und Möglichkeiten der/des Lernpartnerin/ers angepasst werden. - Möglichkeiten für den Hauptteil. Option A: Hausaufgaben oder Prüfung vorbereiten. Aufgaben bearbeiten, Lücken identifizieren und gezielt daran arbeiten. Verständnis der Aufgaben sicherstellen: Lernpartner:in erklären lassen. Option B: Grundlagen: Grundlagen wiederholen und vertiefen. Übungsaufgaben fördern Sicherheit und Selbstvertrauen. Das Verstehen steht im Vordergrund, nicht das “fertig werden”. Hinweis: Dilemma: Wäge von Fall zu Fall ab, ob die Wiederholung von Grundlagen bzw. die Beseitigung von Lücken wichtiger ist oder die Erledigung der Hausaufgaben. Das sollte ca. 35 bis 45 Min. Zeit dauern. Teil 3: “Abschluss”: Zum Schluss kann das Gelernte gesichert, reflektiert und die Beziehung gestärkt werden. - Mögliche Abschlussaktivitäten: Option A. Zusammenfassung der Stunde in 2–3 Sätzen durch die/den Schüler:in. Option B. Reflexion: Besprecht, was gut gelaufen ist und was evtl. noch fehlt. Fortschritte, auch kleine, hervorheben Sinnfrage: Was haben diese Inhalte/Methoden mit mir zu tun? Wann oder wo kann ich sie anwenden? Option C. Nächsten Termin vereinbaren: Klärt gemeinsam, wann die nächste Stunde stattfindet und nehmt euch evtl. etwas vor, z.B. zu Ablauf, Inhalten, Grundlagen. Option D. Glaube, Liebe, Hoffnung: Ermutigung, z. B. bezüglich einer anstehenden Prüfung oder anderen Herausforderung - das ganze sollte 5-8 Min. ausmachen der Zeit. '),
    assessment: z.string().describe('Provide a few example exercises to assess the current knowledge and potential gaps in the knowledge of the student. Include the solutions in paranthesis behind the exercises.'),
    homework: z.string().describe('Provide the knowledge basics to understand the content of the current lecture as somebody who hasnt reviewed this topic in a while and might not be too familiar with it. Try to use as little special vocabulary as possible.'),
    resources: z.string().describe('Provide examples of where in daily life the topic of the lessons is used or needed, to create more real-life context for the pupil and make it interesting.'),
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

    let combinedContent = '';
    const imageContents: { type: 'image_url'; image_url: { url: string } }[] = [];

    if (fileUuids.length > 0) {
        // Fetch file contents for each UUID
        const allFiles = await Promise.all(fileUuids.map((uuid) => readFileContent(uuid)));

        const validFiles = allFiles.filter((file): file is NonNullable<typeof file> => file !== null);

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

        let finalPrompt = `${LESSON_PLAN_PROMPT.replace('{requestedFields}', requestedFields)
            .split('{language}')
            .join(
                language
            )}\n\nCreate a lesson plan for ${subject} students in grade ${grade} in the state ${state}, for a ${schoolType} school. The lesson should last ${duration} minutes. ${prompt}`;

        if (combinedContent) {
            finalPrompt += `\n\nInclude relevant content from the provided materials:\n${combinedContent}`;
        }

        // Only count tokens if the character count exceeds MAX_TOKENS
        if (finalPrompt.length > MAX_TOKENS) {
            const staticTokenCount = countTokens(finalPrompt.replace(combinedContent, ''), MODEL_NAME);

            // Check if the static portion of the prompt exceeds the token limit
            if (staticTokenCount >= MAX_TOKENS) {
                throw new Error(
                    `The static portion of the prompt (${staticTokenCount} tokens) exceeds the maximum token limit (${MAX_TOKENS}). Truncation is not possible.`
                );
            }

            const maxContentTokens = MAX_TOKENS - staticTokenCount;

            // Log token details
            logger.debug(
                `Token counts - Static: ${staticTokenCount}, Dynamic: ${countTokens(combinedContent, MODEL_NAME)}, ` +
                    `Max Allowed: ${MAX_TOKENS}, Remaining: ${maxContentTokens}`
            );

            if (countTokens(combinedContent, MODEL_NAME) > maxContentTokens) {
                logger.warn(`Dynamic content exceeds remaining token limit (${maxContentTokens} tokens).. Truncating...`);

                // Calculate the maximum tokens available for combinedContent

                const truncatedContent = truncateText(combinedContent, MODEL_NAME, maxContentTokens);
                finalPrompt = finalPrompt.replace(combinedContent, truncatedContent);
            }
            logger.debug(`Content truncated to fit within the token limit. Final prompt token count: ${countTokens(finalPrompt, MODEL_NAME)}`);
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

    async function readFileContent(uuid: string): Promise<{ name: string; content: string; type: string } | null> {
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
                docs.map((doc, index) => (file.mimetype === 'application/pdf' ? `Page ${index + 1}:\n${doc.pageContent}` : doc.pageContent)).join('\n\n');

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
    }
}
