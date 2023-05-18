import { Pupil, Student } from '../../graphql/generated';
import { prisma } from '../prisma';
import { getUser } from '../user';
import { User, getUserIdTypeORM } from '../user';
import { getOrCreateConversation } from './conversation';

type Contact = {
    user: User;
    contactReason: string;
    chatId: string;
};

const getContacts = async (user: User) => {
    return await prisma.student.findMany({
        where: {
            OR: [
                { match: { some: { pupilId: user.pupilId } } },
                {
                    subcourse_instructors_student: {
                        some: {
                            subcourse: { subcourse_participants_pupil: { some: { pupilId: user.pupilId } } },
                        },
                    },
                },
            ],
        },
    });
};
const getMatchPartners = async (user: User): Promise<Student[] | Pupil[]> => {
    if (user.pupilId) {
        return await prisma.student.findMany({
            where: {
                match: { some: { pupilId: user.pupilId } },
            },
        });
    }
    if (user.studentId) {
        return await prisma.pupil.findMany({
            where: {
                match: { some: { studentId: user.studentId } },
            },
        });
    }
};
const getSubcourseContact = async (user: User) => {
    return await prisma.student.findMany({
        where: {
            subcourse_instructors_student: {
                some: {
                    subcourse: { subcourse_participants_pupil: { some: { pupilId: user.pupilId } } },
                },
            },
        },
    });
};

export const getMyContacts = async (user: User): Promise<Contact[]> => {
    // TODO const conversation = await getOrCreateConversation()
    // TODO check ownership for querying contacts
    const matchPartners = await getMatchPartners(user);
    const subcourseContacts = await getSubcourseContact(user);
    const contactMap: Map<string, Contact> = new Map();

    matchPartners.forEach(async (partner: Student | Pupil) => {
        const userId = getUserIdTypeORM(partner);
        contactMap.set(userId, {
            user: {
                userID: userId,
                firstname: partner.firstname,
                lastname: partner.lastname,
                email: partner.email,
            },
            contactReason: 'match',
            chatId: '',
        });
    });

    subcourseContacts.forEach(async (contact) => {
        const userId = getUserIdTypeORM(contact);
        contactMap.set(userId, {
            user: {
                userID: userId,
                firstname: contact.firstname,
                lastname: contact.lastname,
                email: contact.email,
            },
            contactReason: 'course',
            chatId: '',
        });
    });

    const myContactOptions = Array.from(contactMap.values());

    return myContactOptions;
};
