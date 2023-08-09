import { prisma } from '../prisma';

export async function isEmailAvailable(email: string) {
    email = email.toLowerCase();
    const pupilHasEmail = (await prisma.pupil.count({ where: { email } })) > 0;
    const studentHasEmail = (await prisma.student.count({ where: { email } })) > 0;
    const screenerHasEmail = (await prisma.screener.count({ where: { email } })) > 0;
    return !pupilHasEmail && !studentHasEmail && !screenerHasEmail;
}
