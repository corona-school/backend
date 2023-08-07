import context from '../../graphql/context';
import { UserInputError } from '../../graphql/error';
import { course_category_enum as CourseCategory } from '@prisma/client';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { User } from '../user';

const logger = getLogger('Course Tags');

export async function createCourseTag(user: User | null, name: string, category: CourseCategory) {
    if ((await prisma.course_tag.count({ where: { category, name } })) > 0) {
        throw new UserInputError(`CourseTag with category ${category} and ${name} already exists!`);
    }

    const tag = await prisma.course_tag.create({
        data: { category, identifier: `${category}/${name}`, name },
    });

    logger.info(`User(${user?.userID}) created CourseTag(${tag.id})`, { name, category });

    return tag;
}
