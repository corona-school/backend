import { Instructor } from '../../graphql/types/instructor';
import { UserType } from '../../graphql/types/user';
import { prisma } from '../prisma';
import { User, getUserIdTypeORM } from '../user';
import { getOrCreateConversation } from './conversation';

type Contact = {
    user: UserType;
    contactReason: string;
    chatId: string;
};
const getMatchPartners = async (user: User) => {
    if (user.studentId) {
        return await prisma.match.findMany({
            include: { pupil: true },
            where: {
                studentId: user.studentId,
                dissolved: false,
            },
        });
    }

    if (user.pupilId) {
        return await prisma.match.findMany({
            select: { student: true },
            where: {
                pupilId: user.pupilId,
                dissolved: false,
            },
        });
    }
};

const getSubcourseInstructors = async (pupil: User) => {
    // TODO get all course instructors that can be contacted
    // where course allowContact is true
    // where subcourse_participants some pupil id

    const result = await prisma.subcourse_participants_pupil.findMany({
        where: { pupilId: pupil.pupilId },
        include: {
            subcourse: {
                include: { subcourse_instructors_student: { include: { student: true } } },
            },
        },
    });
};

export const getMyContacts = async (user: User): Promise<Contact[]> => {
    let myContactOptions: Contact[] = [];
    const matchPartners = await getMatchPartners(user);
    const courseInscturctors = await getSubcourseInstructors(user);
    // TODO const conversation = await getOrCreateConversation()

    matchPartners.forEach((partner) => {
        myContactOptions.push({
            user: partner,
            contactReason: 'match',
            chatId: '',
        });
    });

    return myContactOptions;
};
