import assert from 'assert';
import { prisma } from '../prisma';
import { userForPupil, userForStudent } from '../user';
import { pupil as Pupil, student as Student } from '@prisma/client';
import { User } from '../user';
import { ContactReason } from './types';
import { isPupilContact, isStudentContact } from './helper';
import moment from 'moment';

export type UserContactType = {
    userID: string;
    firstname: string;
    lastname: string;
    email: string;
};

type BaseContactList = {
    [userId: string]: {
        user: UserContactType;
        contactReasons: ContactReason[];
    };
};

type CompleteContactList = BaseContactList & {
    [userId: string]: {
        match?: { matchId: number };
        subcourse?: number[];
    };
};

type MatchContactList = BaseContactList & {
    [userId: string]: {
        match: { matchId: number };
    };
};

type SubcourseContactList = BaseContactList & {
    [userId: string]: {
        subcourse: number[];
    };
};

type SubcourseContactPupil = {
    pupil: Pupil;
    subcourseIds: number[];
};

type SubcourseContactStudent = {
    student: Student;
    subcourseIds: number[];
};

export type MatchContactPupil = {
    pupil: Pupil;
    matchId: number;
};

export type MatchContactStudent = {
    student: Student;
    matchId: number;
};
const getMatchContactsForUser = async (user: User): Promise<MatchContactStudent[] | MatchContactPupil[]> => {
    if (user.pupilId) {
        const matchesWithStudent = await prisma.match.findMany({
            where: {
                pupilId: user.pupilId,
                dissolved: false,
            },
            include: { student: true },
        });

        const studentWithMatchId: MatchContactStudent[] = matchesWithStudent.map((matchWithStudent) => {
            return {
                student: matchWithStudent.student,
                matchId: matchWithStudent.id,
            };
        });
        return studentWithMatchId;
    }
    if (user.studentId) {
        const matchesWithPupil = await prisma.match.findMany({
            where: {
                studentId: user.studentId,
                dissolved: false,
            },
            include: { pupil: true },
        });
        const pupilWithMatchId: MatchContactPupil[] = matchesWithPupil.map((matchWithPupil) => {
            return {
                pupil: matchWithPupil.pupil,
                matchId: matchWithPupil.id,
            };
        });

        return pupilWithMatchId;
    }

    // This can happen if for example a screener is logged in
    return [];
};
const getSubcourseInstructorsForPupil = async (pupil: User): Promise<SubcourseContactStudent[]> => {
    assert(pupil.pupilId, 'Pupil must have an pupilId');
    const yesterday = moment().subtract(1, 'day').toISOString();
    const studentsWithSubcourseIds = await prisma.student.findMany({
        where: {
            subcourse_instructors_student: {
                some: {
                    subcourse: {
                        allowChatContactParticipants: true,
                        subcourse_participants_pupil: { some: { pupilId: pupil.pupilId } },
                        cancelled: false,
                        lecture: { some: { start: { gte: yesterday } } },
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
                where: {
                    subcourse: {
                        subcourse_participants_pupil: {
                            some: { pupilId: pupil.pupilId },
                        },
                    },
                },
            },
        },
    });

    const instructorsWithSubcourseIds: SubcourseContactStudent[] = studentsWithSubcourseIds.map((studentWithSubcourseIds) => {
        const subcourseIds = studentWithSubcourseIds.subcourse_instructors_student.map((participant) => participant.subcourse.id);
        return {
            student: studentWithSubcourseIds,
            subcourseIds: subcourseIds,
        };
    });

    return instructorsWithSubcourseIds;
};
const getSubcourseParticipantsForStudent = async (student: User): Promise<SubcourseContactPupil[]> => {
    assert(student.studentId, 'Student must have an studentId');
    const yesterday = moment().subtract(1, 'day').toISOString();

    const pupilsWithSubcourseIds = await prisma.pupil.findMany({
        where: {
            subcourse_participants_pupil: {
                some: {
                    subcourse: {
                        allowChatContactParticipants: true,
                        subcourse_instructors_student: { some: { studentId: student.studentId } },
                        cancelled: false,
                        lecture: { some: { start: { gte: yesterday } } },
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

    const participantsWithSubcourseIds: SubcourseContactPupil[] = pupilsWithSubcourseIds.map((pupilWithSubcourseIds) => {
        const subcourseIds = pupilWithSubcourseIds.subcourse_participants_pupil.map((participant) => participant.subcourse.id);
        return {
            pupil: pupilWithSubcourseIds,
            subcourseIds: subcourseIds,
        };
    });

    return participantsWithSubcourseIds;
};
const getSubcourseContactsForPupil = async (pupil: User): Promise<SubcourseContactList> => {
    const subcourseContactsList: SubcourseContactList = {};

    const subcourseContacts = await getSubcourseInstructorsForPupil(pupil);
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

    return subcourseContactsList;
};
const getSubcourseContactsForStudent = async (student: User): Promise<SubcourseContactList> => {
    const subcourseContactsList: SubcourseContactList = {};

    const subcourseContacts = await getSubcourseParticipantsForStudent(student);
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

    return subcourseContactsList;
};
const getMyMatchContacts = async (user: User): Promise<MatchContactList> => {
    const matchContactList: MatchContactList = {};
    const matchContacts = await getMatchContactsForUser(user);
    for (const matchContact of matchContacts) {
        let matchee: User;
        if (isStudentContact(matchContact)) {
            matchee = userForStudent(matchContact.student as Student);
        }
        if (isPupilContact(matchContact)) {
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
    let subcourseContacts: CompleteContactList = {};
    if (user.pupilId) {
        subcourseContacts = await getSubcourseContactsForPupil(user);
    }

    if (user.studentId) {
        subcourseContacts = await getSubcourseContactsForStudent(user);
    }
    const matchContacts = await getMyMatchContacts(user);

    for (const contactId in subcourseContacts) {
        const doubleContact = matchContacts[contactId];
        if (doubleContact) {
            subcourseContacts[contactId].contactReasons.push(...doubleContact.contactReasons);
            subcourseContacts[contactId].match = doubleContact.match;
            delete matchContacts[contactId];
        }
    }
    const myContacts: CompleteContactList = { ...subcourseContacts, ...matchContacts };
    const myContactsAsArray = Object.values(myContacts);
    return myContactsAsArray;
};
