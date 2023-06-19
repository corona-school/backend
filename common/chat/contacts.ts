import assert from 'assert';
import { prisma } from '../prisma';
import { isPupil, isStudent, userForPupil, userForStudent } from '../user';
import { pupil as Pupil, student as Student } from '@prisma/client';
import { User } from '../user';
import { ContactReason } from './types';

export type UserContactType = {
    userID: string;
    firstname: string;
    lastname: string;
    email: string;
};

type UserContactlist = {
    [userId: string]: {
        user: UserContactType;
        contactReasons: ContactReason[];
        match?: { matchId: number };
        subcourse?: number[];
    };
};

type PupilWithSubcourseIds = {
    pupil: Pupil;
    subcourseIds: number[];
};

type StudentWithSubcourseIds = {
    student: Student;
    subcourseIds: number[];
};

type PupilWithMatchId = {
    pupil: Pupil;
    matchId: number;
};

type StudentWithMatchId = {
    student: Student;
    matchId: number;
};
const getMatchContacts = async (user: User): Promise<StudentWithMatchId[] | PupilWithMatchId[]> => {
    if (user.pupilId) {
        const studentsWithMatchId = await prisma.student.findMany({
            where: {
                match: { some: { pupilId: user.pupilId, dissolved: false } },
            },
            include: { match: true },
        });

        const studentWithMatchId: StudentWithMatchId[] = studentsWithMatchId.map((studentWithMatchId) => {
            return {
                student: studentWithMatchId,
                matchId: studentWithMatchId.match[0].id,
            };
        });
        return studentWithMatchId;
    }
    if (user.studentId) {
        const pupilsWithMatchId = await prisma.pupil.findMany({
            where: {
                match: { some: { studentId: user.studentId, dissolved: false } },
            },
            include: { match: true },
        });
        const pupilWithMatchId: PupilWithMatchId[] = pupilsWithMatchId.map((pupilWithMatchId) => {
            return {
                pupil: pupilWithMatchId,
                matchId: pupilWithMatchId.match[0].id,
            };
        });

        return pupilWithMatchId;
    }
};
const getSubcourseInstructorContacts = async (pupil: User): Promise<StudentWithSubcourseIds[]> => {
    assert(pupil.pupilId, 'Pupil must have an pupilId');
    const studentsWithSubcourseIds = await prisma.student.findMany({
        where: {
            subcourse_instructors_student: {
                some: {
                    subcourse: {
                        allowChatContactParticipants: true,
                        subcourse_participants_pupil: { some: { pupilId: pupil.pupilId } },
                        cancelled: false,
                    },
                },
            },
        },
        include: {
            subcourse_instructors_student: {
                select: {
                    subcourse: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });

    const instructorsWithSubcourseIds: StudentWithSubcourseIds[] = studentsWithSubcourseIds.map((studentWithSubcourseIds) => {
        const subcourseIds = studentWithSubcourseIds.subcourse_instructors_student.map((participant) => participant.subcourse.id);
        return {
            student: studentWithSubcourseIds,
            subcourseIds: subcourseIds,
        };
    });

    return instructorsWithSubcourseIds;
};
const getSubcourseParticipantContact = async (student: User): Promise<PupilWithSubcourseIds[]> => {
    assert(student.studentId, 'Student must have an studentId');
    const pupilsWithSubcourseIds = await prisma.pupil.findMany({
        where: {
            subcourse_participants_pupil: {
                some: {
                    subcourse: {
                        allowChatContactParticipants: true,
                        subcourse_instructors_student: { some: { studentId: student.studentId } },
                        cancelled: false,
                    },
                },
            },
        },
        include: {
            subcourse_participants_pupil: {
                select: {
                    subcourse: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });

    const participantsWithSubcourseIds: PupilWithSubcourseIds[] = pupilsWithSubcourseIds.map((pupilWithSubcourseIds) => {
        const subcourseIds = pupilWithSubcourseIds.subcourse_participants_pupil.map((participant) => participant.subcourse.id);
        return {
            pupil: pupilWithSubcourseIds,
            subcourseIds: subcourseIds,
        };
    });

    return participantsWithSubcourseIds;
};
const getMySubcourseContacts = async (user: User): Promise<UserContactlist> => {
    let subcourseContactsList: UserContactlist = {};

    if (user.pupilId) {
        const subcourseContacts = await getSubcourseInstructorContacts(user);
        for (const subcourseContact of subcourseContacts) {
            const instructorSubcourseId = userForStudent(subcourseContact.student).userID;
            const contactReasons = [ContactReason.COURSE];

            subcourseContactsList[instructorSubcourseId] = {
                user: {
                    firstname: subcourseContact.student.firstname,
                    lastname: subcourseContact.student.lastname,
                    userID: instructorSubcourseId,
                    email: subcourseContact.student.email,
                },
                contactReasons: contactReasons,
                subcourse: subcourseContact.subcourseIds,
            };
        }
    }

    if (user.studentId) {
        const subcourseContacts = await getSubcourseParticipantContact(user);
        for (const subcourseContact of subcourseContacts) {
            const participantSubcourseId = userForPupil(subcourseContact.pupil).userID;
            const contactReasons = [ContactReason.COURSE];
            subcourseContactsList[participantSubcourseId] = {
                user: {
                    firstname: subcourseContact.pupil.firstname,
                    lastname: subcourseContact.pupil.lastname,
                    userID: participantSubcourseId,
                    email: subcourseContact.pupil.email,
                },
                contactReasons: contactReasons,
                subcourse: subcourseContact.subcourseIds,
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
        if ('student' in matchContact) {
            matchee = userForStudent(matchContact.student as Student);
        }
        if ('pupil' in matchContact) {
            matchee = userForPupil(matchContact.pupil as Pupil);
        }
        const contactReasons = [ContactReason.MATCH];

        matchContactList[matchee.userID] = {
            user: { firstname: matchee.firstname, lastname: matchee.lastname, userID: matchee.userID, email: matchee.email },
            contactReasons: contactReasons,
            match: { matchId: matchContact.matchId },
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
            subcourseContacts[contactId].match = doubleContact.match;
            delete matchContacts[contactId];
        }
    }
    const myContacts = { ...subcourseContacts, ...matchContacts };
    const myContactsAsArray = Object.values(myContacts);
    return myContactsAsArray;
};
