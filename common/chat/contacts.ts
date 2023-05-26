import assert from 'assert';
import { prisma } from '../prisma';
import { isPupil, isStudent, userForPupil, userForStudent } from '../user';
import { pupil as Pupil, student as Student } from '@prisma/client';
import { User } from '../user';

export type UserContactType = {
    userID: string;
    firstname: string;
    lastname: string;
    email: string;
};

type UserContactlist = {
    [userId: string]: {
        user: UserContactType;
        contactReasons: string[];
    };
};

const getMatchContacts = async (user: User): Promise<Student[] | Pupil[]> => {
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
    assert(student.studentId, 'Student must have an studentId');
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
const getMySubcourseContacts = async (user: User): Promise<UserContactlist> => {
    let subcourseContactsList: UserContactlist = {};

    if (user.pupilId) {
        const subcourseContacts = await getSubcourseInstructorContacts(user);
        for (const subcourseContact of subcourseContacts) {
            const instructorSubcourseId = userForStudent(subcourseContact).userID;
            const contactReasons = ['subcourse'];

            subcourseContactsList[instructorSubcourseId] = {
                user: {
                    firstname: subcourseContact.firstname,
                    lastname: subcourseContact.lastname,
                    userID: instructorSubcourseId,
                    email: subcourseContact.email,
                },
                contactReasons: contactReasons,
            };
        }
    }

    if (user.studentId) {
        const subcourseContacts = await getSubcourseParticipantContact(user);
        for (const subcourseContact of subcourseContacts) {
            const participantSubcourseId = userForPupil(subcourseContact).userID;
            const contactReasons = ['subcourse'];

            subcourseContactsList[participantSubcourseId] = {
                user: {
                    firstname: subcourseContact.firstname,
                    lastname: subcourseContact.lastname,
                    userID: participantSubcourseId,
                    email: subcourseContact.email,
                },
                contactReasons: contactReasons,
            };
        }
    }

    return subcourseContactsList;
};
const getMyMatchContacts = async (user: User): Promise<UserContactlist> => {
    let matchContactList: UserContactlist = {};
    const matchContacts = await getMatchContacts(user);
    for (const matchContact of matchContacts) {
        let matchee: User;
        if (isStudent(matchContact)) {
            matchee = userForStudent(matchContact as Student);
        }
        if (isPupil(matchContact)) {
            matchee = userForPupil(matchContact as Pupil);
        }
        const contactReasons = ['match'];

        matchContactList[matchee.userID] = {
            user: { firstname: matchee.firstname, lastname: matchee.lastname, userID: matchee.userID, email: matchee.email },
            contactReasons: contactReasons,
        };
    }

    return matchContactList;
};
export const getMyContacts = async (user: User) => {
    const subcourseContacts = await getMySubcourseContacts(user);
    const matchContacts = await getMyMatchContacts(user);

    for (const contactId in subcourseContacts) {
        const doubleContact = matchContacts[contactId];
        if (doubleContact) {
            subcourseContacts[contactId].contactReasons.push(...doubleContact.contactReasons);
            delete matchContacts[contactId];
        }
    }
    const myContacts = { ...subcourseContacts, ...matchContacts };
    const myContactsAsArray = Object.values(myContacts);
    return myContactsAsArray;
};
