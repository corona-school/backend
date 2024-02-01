import { userForStudent } from '../user';
import { prisma } from '../prisma';

export async function deleteAchievementsForSubcourse(subcourseId: number) {
    const courseInstructors = await prisma.subcourse_instructors_student.findMany({ where: { subcourseId }, select: { student: true } });
    await deleteCourseAchievementsForStudents(
        subcourseId,
        courseInstructors.map((instructor) => userForStudent(instructor.student).userID)
    );
}

export async function deleteCourseAchievementsForStudents(subcourseId: number, studentIds: string[]) {
    await prisma.user_achievement.deleteMany({
        where: {
            userId: {
                in: studentIds,
            },
            relation: `subcourse/${subcourseId}`,
        },
    });
}
