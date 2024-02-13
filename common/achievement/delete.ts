import { userForPupil, userForStudent } from '../user';
import { prisma } from '../prisma';

export async function deleteAchievementsForSubcourse(subcourseId: number) {
    const courseInstructors = await prisma.subcourse_instructors_student.findMany({ where: { subcourseId }, select: { student: true } });
    await deleteCourseAchievementsForStudents(
        subcourseId,
        courseInstructors.map((instructor) => userForStudent(instructor.student).userID)
    );
    const courseParticipants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId }, select: { pupil: true } });
    await deleteAchievementsForParticipants(
        subcourseId,
        courseParticipants.map((participant) => userForPupil(participant.pupil).userID)
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

export async function deleteAchievementsForParticipants(subcourseId: number, pupilIds: string[]) {
    await prisma.user_achievement.deleteMany({
        where: {
            userId: {
                in: pupilIds,
            },
            relation: `subcourse/${subcourseId}`,
        },
    });
}
