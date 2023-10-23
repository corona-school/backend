import { Prisma, course as Course, course_subject_enum as CourseSubject } from '@prisma/client';
import { prisma } from '../prisma';

export async function courseSearch(search?: string): Promise<Prisma.courseWhereInput> {
    if (!search) {
        return {};
    }

    // Search Texts

    const filters: Prisma.courseWhereInput['OR'] = [
        { name: { contains: search, mode: 'insensitive' } },
        { outline: { contains: search, mode: 'insensitive' } },
        // { description: { contains: search, mode: "insensitive" } }
    ];

    // Search Subjects

    const relevantSubjects: CourseSubject[] = [];

    for (const word of search.split(' ')) {
        const sanitizedWord = word.replace(/[öäü]/g, '_');
        const uppercasedWord = sanitizedWord[0].toUpperCase() + sanitizedWord.slice(1).toLowerCase();
        if (uppercasedWord in CourseSubject) {
            relevantSubjects.push(uppercasedWord as CourseSubject);
        }
    }

    if (relevantSubjects.length > 0) {
        filters.push({
            subject: { in: relevantSubjects },
        });
    }

    // Search Course Tags
    const relevantTags = await prisma.course_tag.findMany({ where: { name: { in: search.split(' '), mode: 'insensitive' } }, select: { id: true } });
    if (relevantTags.length > 0) {
        filters.push({
            course_tags_course_tag: { some: { course_tag: { id: { in: relevantTags.map((it) => it.id) } } } },
        });
    }

    return { OR: filters };
}

export async function subcourseSearch(search?: string): Promise<Prisma.subcourseWhereInput> {
    if (!search) {
        return {};
    }

    return { course: await courseSearch(search) };
}
