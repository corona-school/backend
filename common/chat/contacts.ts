import assert from 'assert';
import { Pupil, Student } from '../../graphql/generated';
import { prisma } from '../prisma';
import { getUser, isPupil, isStudent } from '../user';
import { User, getUserIdTypeORM } from '../user';
import { getOrCreateConversation } from './conversation';

type Contact = {
    user: Pick<User, 'userID' | 'firstname' | 'lastname'>;
    contactReason: string;
    chatId: string;
};

const getMatchAndSubcourseContacts = async (user: User) => {
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
const getSubcourseInstructorContacts = async (pupil: User) => {
    assert(pupil.pupilId, 'Pupil must have an pupilId');
    return await prisma.student.findMany({
        where: {
            subcourse_instructors_student: {
                some: {
                    subcourse: { subcourse_participants_pupil: { some: { pupilId: pupil.pupilId } } },
                },
            },
        },
    });
};

export const getMyContacts = async (user: User): Promise<Contact[]> => {
    // TODO const conversation = await getOrCreateConversation()
    const contactMap: Map<string, Contact> = new Map();

    const matchPartners = await getMatchPartners(user);
    matchPartners.forEach((partner: Student | Pupil) => {
        const userId = getUserIdTypeORM(partner);
        contactMap.set(userId, {
            user: {
                userID: userId,
                firstname: partner.firstname,
                lastname: partner.lastname,
            },
            contactReason: 'match',
            chatId: '',
        });
    });

    if (user.pupilId) {
        const subcourseContacts = await getSubcourseInstructorContacts(user);
        subcourseContacts.forEach((contact) => {
            const userId = getUserIdTypeORM(contact);
            contactMap.set(userId, {
                user: {
                    userID: userId,
                    firstname: contact.firstname,
                    lastname: contact.lastname,
                },
                contactReason: 'course',
                chatId: '',
            });
        });
    }

    const myContactOptions = Array.from(contactMap.values());

    return myContactOptions;
};
