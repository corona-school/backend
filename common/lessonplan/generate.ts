import { getLogger } from '../logger/logger';
import { getFile, FileID } from '../../graphql/files';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

const logger = getLogger('LessonPlan Generator');

const plan = z.object({
    title: z.string().describe('The title of the lesson'),
    materials: z.string().describe('Used learning Materials'),
    lesson_plan: z.string().describe('The lesson plan with timeline and learning content'),
});

const LESSON_PLAN_PROMPT = `Begin by enclosing all thoughts within <thinking> tags, exploring multiple angles and approaches.
Break down the solution into clear steps within <step> tags. Start with a 20-step budget, requesting more for complex problems if needed.
Use <count> tags after each step to show the remaining budget. Stop when reaching 0.
Continuously adjust your reasoning based on intermediate results and reflections, adapting your strategy as you progress.
Regularly evaluate progress using <reflection> tags. Be critical and honest about your reasoning process.
Assign a quality score between 0.0 and 1.0 using <reward> tags after each reflection. Use this to guide your approach:

0.8+: Continue current approach
0.5-0.7: Consider minor adjustments
Below 0.5: Seriously consider backtracking and trying a different approach

If unsure or if reward score is low, backtrack and try a different approach, explaining your decision within <thinking> tags.
For mathematical problems, show all work explicitly using LaTeX for formal notation and provide detailed proofs.
Explore multiple solutions individually if possible, comparing approaches in reflections.
Use thoughts as a scratchpad, writing out all calculations and reasoning explicitly.
Synthesize the final answer within <answer> tags, providing a clear, concise summary.
Conclude with a final reflection on the overall solution, discussing effectiveness, challenges, and solutions. Assign a final reward score.`;

export async function generateLessonPlan(fileUuids: FileID[], subject: string, grade: number, duration: number, outputRequirements: string[]): Promise<string> {
    logger.info(`Generating lesson plan for subject: ${subject}, grade: ${grade}, duration: ${duration} minutes`);

    // Fetch file contents for each UUID
    const files = await Promise.all(
        fileUuids.map(async (uuid) => {
            try {
                const file = getFile(uuid);
                const blob = new Blob([file.buffer], { type: 'application/pdf' });
                const loader = new PDFLoader(blob);
                const docs = await loader.load();
                return {
                    name: file.originalname,
                    content: docs.map((doc) => doc.pageContent).join('\n\n'),
                    type: file.mimetype,
                };
            } catch (error) {
                logger.error(`Error fetching or parsing file with UUID ${uuid}: ${error.message}`);
                return null;
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
        modelName: 'gpt-4o',
        temperature: 0,
    });

    const structuredLlm = model.withStructuredOutput(plan);

    try {
        logger.info('Generating lesson plan...');
        const reasoning = await model.invoke(
            `${LESSON_PLAN_PROMPT}\nCreate a lesson plan for ${subject} students in grade ${grade} about the topic ${outputRequirements.join(
                ', '
            )}. The lesson should last ${duration} minutes. Include some of the contents from the provided materials: \n${combinedContent}`
        );

        logger.info('Extracting structured lesson plan...');
        const answer = await structuredLlm.invoke(`${reasoning.content}\n Based on the previous answer and reasoning process extract the lesson plan.`);

        return JSON.stringify(answer, null, 2);
    } catch (error) {
        logger.error(`Error generating lesson plan: ${error.message}`);
        throw new Error('Failed to generate lesson plan');
    }
}
