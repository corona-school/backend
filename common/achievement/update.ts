import { course } from '@prisma/client';
import { prisma } from '../prisma';

export async function updateAchievementCTXByCourse(newCourse: course) {
    const subcourses = await prisma.subcourse.findMany({
        where: { courseId: newCourse.id },
    });

    for (const subcourse of subcourses) {
        const usersSubcourseAchievements = await prisma.user_achievement.findMany({
            where: { relation: `subcourse/${subcourse.id}` },
            include: { template: true },
        });
        for (const achievement of usersSubcourseAchievements) {
            const { context } = achievement;
            context['courseName'] = newCourse.name;
            await prisma.user_achievement.update({
                where: { id: achievement.id },
                data: { context },
            });
        }
    }
}
