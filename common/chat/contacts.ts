import assert from 'assert';
// import { Pupil, Student } from '../../graphql/generated';
import { prisma } from '../prisma';
import { isPupil, isStudent, userForPupil, userForStudent } from '../user';
import { pupil as Pupil, student as Student } from '@prisma/client';
import { User } from '../user';
import { getOrCreateConversation } from './conversation';

export type UserContactType = {
    userID: string;
    firstname: string;
    lastname: string;
};

type Contact = {
    user: UserContactType;
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

const getSubcourseParticipantContact = async (student: User) => {
    assert(student.studentId, 'Pupil must have an pupilId');
    return await prisma.pupil.findMany({
        where: {
            subcourse_participants_pupil: {
                some: {
                    subcourse: { subcourse_instructors_student: { some: { studentId: student.studentId } } },
                },
            },
        },
    });
};

export const getMyContacts = async (user: User): Promise<Contact[]> => {
    // TODO get convo id if exists
    // const conversation = await getOrCreateConversation()
    const contactMap: Map<string, Contact> = new Map();
    const matchPartners = await getMatchPartners(user);

    matchPartners.forEach((partner: Student | Pupil) => {
        let matchee: User;
        if (isStudent(partner)) {
            matchee = userForStudent(partner as Student);
        }
        if (isPupil(partner)) {
            matchee = userForPupil(partner as Pupil);
        }
        contactMap.set(matchee.userID, {
            user: {
                userID: matchee.userID,
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
            const student = userForStudent(contact);
            contactMap.set(student.userID, {
                user: {
                    userID: student.userID,
                    firstname: contact.firstname,
                    lastname: contact.lastname,
                },
                contactReason: 'course',
                chatId: '',
            });
        });
    }

    if (user.studentId) {
        const subcourseContacts = await getSubcourseParticipantContact(user);
        subcourseContacts.forEach((contact) => {
            const pupil = userForPupil(contact);
            contactMap.set(pupil.userID, {
                user: {
                    userID: pupil.userID,
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
