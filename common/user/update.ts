import { User, getUser, userForPupil, userForStudent, userSelection, getStudent } from '.';
import { pupil as Pupil, student as Student } from '@prisma/client';
import { validateEmail } from '../../graphql/validators';
import { prisma } from '../prisma';
import { changeEmail } from '../zoom/user';
import { isZoomFeatureActive } from '../zoom/util';

export async function updateUser(userId: string, { email }: Partial<Pick<User, 'email'>>) {
    const validatedEmail = validateEmail(email);
    const user = await getUser(userId, /* active */ true);
    if (user.studentId) {
        if (isZoomFeatureActive()) {
            await changeEmail(await getStudent(user), validatedEmail);
        }

        return userForStudent(
            (await prisma.student.update({
                where: { id: user.studentId },
                data: { email: validatedEmail },
                select: userSelection,
            })) as Student
        );
    }
    if (user.pupilId) {
        return userForPupil(
            (await prisma.pupil.update({
                where: { id: user.pupilId },
                data: { email: validatedEmail },
                select: userSelection,
            })) as Pupil
        );
    }
}
