/* eslint-disable comma-dangle */
import 'reflect-metadata';
import { createHash, randomBytes } from 'crypto';
import { getNotifications, importMessageTranslations, importNotifications } from './common/notification/notification';
import { _createFixedToken, createPassword, verifyEmail } from './common/secret';
import { userForStudent, userForPupil, refetchPupil, refetchStudent, userForScreener } from './common/user';
import { getLogger } from './common/logger/logger';
import { BecomeTuteeData, registerPupil, RegisterPupilData } from './common/pupil/registration';
import { isDev, isTest } from './common/util/environment';
import { prisma } from './common/prisma';
import { becomeInstructor, becomeTutor, BecomeTutorData, registerStudent, RegisterStudentData } from './common/student/registration';
import { addInstructorScreening, addTutorScreening } from './common/student/screening';
import { addPupilScreening } from './common/pupil/screening';
import { createMatch } from './common/match/create';
import { TEST_POOL } from './common/match/pool';
import { createRemissionRequest } from './common/remission-request';
import { joinSubcourse, joinSubcourseWaitinglist } from './common/courses/participants';
import { addCourseInstructor, addSubcourseInstructor } from './common/courses/states';
import { createPupilMatchRequest, createStudentMatchRequest } from './common/match/request';
import { createCourseTag } from './common/courses/tags';
import { _setSilenceNotificationSystem } from './common/notification';
import {
    course_category_enum as CourseCategory,
    course_coursestate_enum as CourseState,
    course_subject_enum as CourseSubject,
    lecture_appointmenttype_enum as AppointmentType,
    screener as Screener,
    pupil as Pupil,
    student as Student,
    course_subject_enum,
    learning_assignment_status,
    pupil_email_owner_enum,
} from '@prisma/client';
import { importAchievements } from './seed-achievements';

const logger = getLogger('DevSetup');

interface CreatePupilArgs extends Partial<RegisterPupilData>, BecomeTuteeData {
    includePassword?: boolean;
}

const createPupil = async ({ includePassword = true, ...data }: CreatePupilArgs) => {
    const pupil = await registerPupil({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        aboutMe: data.aboutMe,
        newsletter: data.newsletter ?? false,
        registrationSource: 'normal',
        school: data.school ?? {
            name: 'Muster Schule',
            schooltype: 'gymnasium',
            state: 'be',
        },
        emailOwner: pupil_email_owner_enum.pupil,
    });
    await _createFixedToken(userForPupil(pupil), `authtokenP${pupil.id}`);
    if (includePassword) {
        await createPassword(userForPupil(pupil), `test`);
    }
    await verifyEmail(userForPupil(pupil));
    const verifiedPupil = await refetchPupil(pupil);
    await addPupilScreening(verifiedPupil, { comment: '', status: 'success', invalidated: false });
    return await prisma.pupil.update({
        where: { id: pupil.id },
        data: {
            languages: data.languages,
            subjects: JSON.stringify(data.subjects),
            learningGermanSince: data.learningGermanSince,
            grade: `${data.gradeAsInt}. Klasse`,
        },
    });
};

interface CreateStudentArgs extends Partial<RegisterStudentData>, BecomeTutorData {
    isInstructor?: boolean;
}

const createStudent = async ({ isInstructor = true, ...data }: CreateStudentArgs, screener: Screener) => {
    const student = await registerStudent({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        aboutMe: data.aboutMe,
        newsletter: false,
        registrationSource: 'normal',
    });
    await verifyEmail(userForStudent(student));
    await _createFixedToken(userForStudent(student), `authtokenS${student.id}`);
    await createPassword(userForStudent(student), `test`);
    await createRemissionRequest(student);
    await becomeTutor(student, {
        languages: data.languages,
        subjects: data.subjects,
    });
    await addTutorScreening(screener, student, { success: true });
    await prisma.student.update({ where: { id: student.id }, data: { hasDoneEthicsOnboarding: true } });
    if (isInstructor) {
        await becomeInstructor(student, {});
        await addInstructorScreening(
            screener,
            student,
            {
                success: true,
                comment: 'Success',
            },
            false
        );
    }
    return refetchStudent(student);
};

interface CreateTutoringMatchArgs {
    pupil: Pupil;
    student: Student;
    topics?: {
        name: string;
        subject: course_subject_enum;
        assignments: {
            status: learning_assignment_status;
            task: string;
        }[];
    }[];
}

const createTutoringMatch = async (data: CreateTutoringMatchArgs) => {
    const { topics = [] } = data;
    await createPupilMatchRequest(data.pupil);
    await createStudentMatchRequest(data.student);
    const match = await createMatch(await refetchPupil(data.pupil), await refetchStudent(data.student), TEST_POOL);
    if (topics.length) {
        for (const topic of topics) {
            const createdTopic = await prisma.learning_topic.create({
                data: {
                    matchId: match.id,
                    name: topic.name,
                    subject: topic.subject,
                    pupilId: match.pupilId,
                },
            });
            for (const assignment of topic.assignments) {
                await prisma.learning_assignment.create({
                    data: {
                        status: assignment.status,
                        task: assignment.task,
                        topicId: createdTopic.id,
                    },
                });
            }
        }
    }
};

interface CreateCourseArgs {
    name: string;
    outline?: string;
    description: string;
    category: CourseCategory;
    state: CourseState;
    subject?: CourseSubject;
    allowContact?: boolean;
    joinAfterStart?: boolean;
    minGrade?: number;
    maxGrade?: number;
    maxParticipants?: number;
    published?: boolean;
    course_tags_course_tag?: {
        create: {
            courseTagId: number;
        };
    };
    instructors: Student[];
    participants: Pupil[];
    lectures: Omit<CreateLecturesArgs, 'subcourseId'>;
}

interface CreateLecturesArgs {
    amount: number;
    intervalInDays: number;
    startOffsetInDays: number;
    participantsIds?: string[];
    organizerIds?: string[];
    subcourseId: number;
}

const createLectures = async ({ amount, intervalInDays, startOffsetInDays, subcourseId, organizerIds, participantsIds }: CreateLecturesArgs) => {
    let currentLecture = Date.now() + startOffsetInDays * 24 * 60 * 60 * 1000;
    const interval = intervalInDays * 24 * 60 * 60 * 1000;

    for (let i = 0; i < amount; i++) {
        const start = new Date(currentLecture);
        await prisma.lecture.create({
            data: {
                subcourseId: subcourseId,
                duration: 60,
                start,
                organizerIds: start <= new Date() ? organizerIds : [],
                participantIds: start <= new Date() ? participantsIds : [],
                appointmentType: 'group',
            },
        });

        currentLecture += interval;
    }
};

const createCourse = async (data: CreateCourseArgs) => {
    const course = await prisma.course.create({
        data: {
            name: data.name,
            outline: data.outline ?? '',
            description: data.description,
            category: data.category,
            courseState: data.state,
            subject: data.subject,
            allowContact: data.allowContact ?? true,
            course_tags_course_tag: data?.course_tags_course_tag,
        },
    });
    const subcourse = await prisma.subcourse.create({
        data: {
            courseId: course.id,
            joinAfterStart: data.joinAfterStart ?? true,
            minGrade: data.minGrade ?? 1,
            maxGrade: data.maxGrade ?? 14,
            maxParticipants: data.maxParticipants ?? 10,
            published: data.published ?? true,
        },
    });

    await createLectures({
        subcourseId: subcourse.id,
        ...data.lectures,
        participantsIds: data.participants.map((e) => `pupil/${e.id}`),
        organizerIds: [...data.instructors.map((e) => `student/${e.id}`)],
    });

    // Add Instructors and Participants after adding Lectures, so that they are also added to the lectures:
    await addCourseInstructor(null, course, data.instructors[0]);
    for (const instructor of data.instructors) {
        await addSubcourseInstructor(null, subcourse, instructor);
    }
    for (const participant of data.participants) {
        await joinSubcourse(subcourse, participant, false);
    }
    return [course, subcourse] as const;
};

void (async function setupDevDB() {
    if (!isDev && !isTest) {
        throw new Error(`Are you sure you want to seed the DB in a non development / test environment?`);
    }

    if ((await prisma.pupil.count()) > 0) {
        throw new Error(`Cannot seed a non empty database. Use npm run db:reset-hard to drop it`);
    }

    logger.info('Starting to Seed DB');

    _setSilenceNotificationSystem(true);

    await prisma.cooperation.create({
        data: {
            name: 'Lern-Fair e.V.',
            tag: 'self',

            welcomeTitle: 'Wilkommen im Userbereich',
            welcomeMessage: 'Als Lern-Fairer kennst du dich ja hier aus :)',
        },
    });

    const pupil1 = await createPupil({
        firstname: 'Max',
        lastname: 'Musterschüler',
        email: 'test+dev+p1@lern-fair.de',
        aboutMe: 'Hallo 👋! Ich heiße Max und ich interessiere mich für Englisch und Mathe',
        languages: ['Deutsch', 'Italienisch'],
        subjects: [{ name: 'Englisch' }, { name: 'Französisch' }, { name: 'Mathematik', mandatory: true }],
        gradeAsInt: 6,
    });

    const pupil2 = await createPupil({
        firstname: 'Tom',
        lastname: 'Musterschüler',
        email: 'test+dev+p2@lern-fair.de',
        aboutMe: 'Hallo, ich bin Tom und ich lerne Deutsch!',
        languages: ['Englisch'],
        subjects: [{ name: 'Deutsch als Zweitsprache', mandatory: true }],
        gradeAsInt: 6,
        learningGermanSince: 'one_to_two',
    });

    const pupil3 = await createPupil({
        firstname: 'Lena',
        lastname: 'Musterschüler',
        email: 'test+dev+p3@lern-fair.de',
        aboutMe: 'Hi, ich bin Lena und ich liebe Mathe und Biologie!',
        languages: ['Deutsch', 'Franz_sisch'],
        subjects: [{ name: 'Mathematik', mandatory: true }, { name: 'Biologie' }, { name: 'Französisch' }, { name: 'Englisch' }],
        gradeAsInt: 6,
    });

    const pupil4 = await createPupil({
        firstname: 'Aisha',
        lastname: 'Musterschüler',
        email: 'test+dev+p4@lern-fair.de',
        aboutMe: "I'm Aisha, and I want to improve my German",
        languages: ['Englisch', 'Arabisch'],
        subjects: [{ name: 'Deutsch als Zweitsprache', mandatory: true }],
        learningGermanSince: 'one_to_two',
        gradeAsInt: 7,
    });

    const pupil5 = await createPupil({
        firstname: 'Sofia',
        lastname: 'Musterschüler',
        email: 'test+dev+p5@lern-fair.de',
        aboutMe: 'Ich bin Sofia und ich interessiere mich sehr für Deutsch und Englisch.',
        languages: ['Italienisch'],
        subjects: [
            { name: 'Deutsch als Zweitsprache', mandatory: true },
            { name: 'Englisch', mandatory: true },
        ],
        learningGermanSince: 'two_to_four',
        gradeAsInt: 5,
    });

    const pupil6 = await createPupil({
        firstname: 'Yusuf',
        lastname: 'Musterschüler',
        email: 'test+dev+p6@lern-fair.de',
        aboutMe: 'Moin, ich heiße Yusuf und ich liebe Mathe und Chemie',
        languages: ['T_rkisch', 'Englisch', 'Deutsch'],
        subjects: [{ name: 'Mathematik', mandatory: true }, { name: 'Chemie' }],
        gradeAsInt: 10,
    });

    const pupil7 = await createPupil({
        firstname: 'Emilia',
        lastname: 'Musterschüler',
        email: 'test+dev+p7@lern-fair.de',
        aboutMe: 'Ich bin Emilia und ich lese gerne Bücher und liebe Englisch.',
        languages: ['Deutsch'],
        subjects: [{ name: 'Mathematik', mandatory: true }, { name: 'Englisch' }],
        gradeAsInt: 4,
    });

    const pupil8 = await createPupil({
        firstname: 'Diego',
        lastname: 'Musterschüler',
        email: 'test+dev+p8@lern-fair.de',
        aboutMe: "I'm Diego, and I enjoy learning about math and science.",
        languages: ['Spanisch', 'Englisch'],
        subjects: [{ name: 'Deutsch als Zweitsprache', mandatory: true }, { name: 'Mathematik' }, { name: 'Englisch' }],
        learningGermanSince: 'two_to_four',
        gradeAsInt: 6,
    });

    const pupil9 = await createPupil({
        firstname: 'Sarah',
        lastname: 'Musterschüler',
        email: 'test+dev+p9@lern-fair.de',
        aboutMe: 'Hallo, ich bin Sarah und Mathe ist mein Lieblingsfach!',
        languages: ['Deutsch', 'Englisch'],
        subjects: [{ name: 'Mathematik', mandatory: true }, { name: 'Biologie' }, { name: 'Englisch' }],
        gradeAsInt: 10,
    });

    const pupil10 = await createPupil({
        firstname: 'Mateo',
        lastname: 'Musterschüler',
        email: 'test+dev+p10@lern-fair.de',
        aboutMe: "I'm Mateo, and I'm working on improving my German skills",
        languages: ['Spanisch', 'Englisch'],
        subjects: [
            { name: 'Deutsch als Zweitsprache', mandatory: true },
            { name: 'Mathematik', mandatory: true },
        ],
        learningGermanSince: 'two_to_four',
        gradeAsInt: 4,
        includePassword: false,
    });

    const screener1 = await prisma.screener.create({
        data: {
            firstname: 'Alina',
            lastname: 'Screenerfrau',
            email: 'test+dev+sc1@lern-fair.de',
            password: 'LEGACY',
            verified: true,
            active: true,
            is_course_screener: true,
            is_pupil_screener: true,
            is_student_screener: true,
            is_trusted: true,
        },
    });
    await _createFixedToken(userForScreener(screener1), `authtokenSC1`);
    await createPassword(userForScreener(screener1), `test`);

    const screener2 = await prisma.screener.create({
        data: {
            firstname: 'Lina',
            lastname: 'Screenerfrau',
            email: 'test+dev+sc2@lern-fair.de',
            password: 'LEGACY',
            verified: true,
            active: true,
            is_course_screener: true,
            is_pupil_screener: false,
            is_student_screener: false,
            is_trusted: false,
        },
    });
    await _createFixedToken(userForScreener(screener2), `authtokenSC2`);
    await createPassword(userForScreener(screener2), `test`);

    const screener3 = await prisma.screener.create({
        data: {
            firstname: 'Leto',
            lastname: 'Atreides',
            email: 'test+dev+sc3@lern-fair.de',
            password: 'LEGACY',
            verified: true,
            active: true,
            is_course_screener: false,
            is_pupil_screener: true,
            is_student_screener: false,
            is_trusted: false,
        },
    });
    await _createFixedToken(userForScreener(screener3), `authtokenSC3`);
    await createPassword(userForScreener(screener3), `test`);

    const screener4 = await prisma.screener.create({
        data: {
            firstname: 'Paul',
            lastname: 'Atreides',
            email: 'test+dev+sc4@lern-fair.de',
            password: 'LEGACY',
            verified: true,
            active: true,
            is_course_screener: false,
            is_pupil_screener: false,
            is_student_screener: true,
            is_trusted: false,
        },
    });
    await _createFixedToken(userForScreener(screener4), `authtokenSC4`);
    await createPassword(userForScreener(screener4), `test`);

    const student1 = await createStudent(
        {
            firstname: 'Leon',
            lastname: 'Jackson',
            email: 'test+dev+s1@lern-fair.de',
            aboutMe: `Im Student 1`,
            languages: ['Deutsch', 'Englisch', 'Spanisch'],
            subjects: [
                { name: 'Spanisch', grade: { min: 4, max: 10 } },
                { name: 'Deutsch als Zweitsprache', grade: { min: 4, max: 10 } },
                { name: 'Englisch', grade: { min: 4, max: 10 } },
                { name: 'Deutsch', grade: { min: 4, max: 10 } },
                { name: 'Mathematik', grade: { min: 4, max: 10 } },
            ],
        },
        screener1
    );

    const student2 = await createStudent(
        {
            firstname: 'Melanie',
            lastname: 'Meiers',
            aboutMe: `Im Student 2`,
            email: 'test+dev+s2@lern-fair.de',
            newsletter: false,
            registrationSource: 'normal',
            languages: ['Deutsch', 'Englisch', 'Franz_sisch'],
            subjects: [
                { name: 'Deutsch als Zweitsprache', grade: { min: 1, max: 14 } },
                { name: 'Französisch', grade: { min: 1, max: 14 } },
                { name: 'Mathematik', grade: { min: 1, max: 14 } },
                { name: 'Englisch', grade: { min: 1, max: 14 } },
            ],
        },
        screener2
    );
    await prisma.student.update({
        where: { id: student2.id },
        data: { zoomUserId: 'kLKyaiAyTNC-MWjiWCFFFF' },
    });

    const student3 = await createStudent(
        {
            firstname: 'Jon',
            lastname: 'Doe',
            email: 'test+dev+s3@lern-fair.de',
            aboutMe: `I'm Student 3`,
            newsletter: false,
            registrationSource: 'normal',
            languages: ['Deutsch', 'Englisch', 'Franz_sisch'],
            subjects: [
                { name: 'Französisch', grade: { min: 4, max: 10 } },
                { name: 'Englisch', grade: { min: 1, max: 14 } },
            ],
        },
        screener1
    );

    const student4 = await createStudent(
        {
            firstname: 'Jack',
            lastname: 'Doe',
            email: 'test+dev+s4@lern-fair.de',
            aboutMe: `I'm Student 4`,
            newsletter: false,
            registrationSource: 'normal',
            languages: ['Englisch', 'Franz_sisch', 'Deutsch'],
            subjects: [
                { name: 'Französisch', grade: { min: 1, max: 14 } },
                { name: 'Mathematik', grade: { min: 1, max: 10 } },
            ],
        },
        screener1
    );

    const student5 = await createStudent(
        {
            firstname: 'Jane',
            lastname: 'Doe',
            email: 'test+dev+s5@lern-fair.de',
            aboutMe: `I'm Student 5`,
            newsletter: false,
            registrationSource: 'normal',
            languages: ['Englisch', 'Arabisch', 'Deutsch'],
            subjects: [
                { name: 'Französisch', grade: { min: 1, max: 14 } },
                { name: 'Mathematik', grade: { min: 1, max: 10 } },
                { name: 'Biologie', grade: { min: 1, max: 10 } },
            ],
            isInstructor: false,
        },
        screener1
    );

    await createTutoringMatch({
        pupil: pupil1,
        student: student1,
        topics: [
            {
                name: 'Nullstellenbestimmung',
                subject: 'Mathematik',
                assignments: [
                    { status: 'pending', task: 'Bestimme die Nullstellen der Funktion f(x) = x ** 2 - 9' },
                    { status: 'pending', task: 'Bestimme die Nullstellen der Funktion f(x) = x ** 2 - 6x + 9' },
                ],
            },
            {
                name: 'Simple Past',
                subject: 'Englisch',
                assignments: [
                    {
                        status: 'pending',
                        task: "Übersetze 'Ich ging gestern zur Schule' ins Englische",
                    },
                ],
            },
        ],
    });

    await createTutoringMatch({ pupil: pupil1, student: student3 });
    await createTutoringMatch({ pupil: pupil2, student: student1 });
    await createTutoringMatch({ pupil: pupil3, student: student1 });
    await createTutoringMatch({ pupil: pupil6, student: student1 });
    await createTutoringMatch({ pupil: pupil3, student: student3 });
    await createTutoringMatch({ pupil: pupil4, student: student2 });
    await createTutoringMatch({ pupil: pupil5, student: student2 });
    await createTutoringMatch({ pupil: pupil8, student: student2 });

    const keepAtIt = await createCourseTag(null, 'Dranbleiben', CourseCategory.focus);
    await createCourseTag(null, 'Denk an Dich', CourseCategory.focus);
    const yourFuture = await createCourseTag(null, 'Deine Zukunft', CourseCategory.focus);
    const digitalWorld = await createCourseTag(null, 'Digitale Welt', CourseCategory.focus);
    await createCourseTag(null, 'Für Eltern', CourseCategory.focus);
    const a1 = await createCourseTag(null, 'A1', CourseCategory.language);
    const a2 = await createCourseTag(null, 'A2', CourseCategory.language);
    await createCourseTag(null, 'B1', CourseCategory.language);

    const [course1, subcourse1] = await createCourse({
        name: 'Deutsch Grammatik für Anfänger 📚',
        outline: 'Grundlagen der deutschen Grammatik, Satzbau, Zeiten und Rechtschreibung.',
        description:
            'Lerne die Grundlagen der deutschen Sprache! 🧠 Mit einfachen Übungen und vielen Beispielen wirst du schnell die Regeln verstehen. Gemeinsam schauen wir uns Satzbau, Wortarten und Rechtschreibung an. Deutsch ist gar nicht so schwer, wenn man es spielerisch lernt! 😊',
        category: CourseCategory.language,
        state: CourseState.allowed,
        subject: 'Deutsch_als_Zweitsprache',
        course_tags_course_tag: { create: { courseTagId: a1.id } },
        maxParticipants: 10,
        instructors: [student1],
        participants: [pupil4, pupil5, pupil8, pupil10],
        lectures: { amount: 20, intervalInDays: 1, startOffsetInDays: -2 },
    });

    const [course2, subcourse2] = await createCourse({
        name: 'Gesprächskurs Deutsch 💬',
        outline: 'Sprechen, Zuhören und Alltagsgespräche üben.',
        description:
            'In diesem Kurs üben wir das freie Sprechen auf Deutsch. 🎙️ Du lernst, dich in alltäglichen Situationen sicher auszudrücken und verstehst, wie man höflich und freundlich Gespräche führt. Ideal, um Selbstbewusstsein beim Sprechen zu gewinnen und neue Freunde zu finden! 🤗',
        category: CourseCategory.language,
        subject: CourseSubject.Deutsch_als_Zweitsprache,
        course_tags_course_tag: { create: { courseTagId: a2.id } },
        state: CourseState.allowed,
        maxParticipants: 5,
        instructors: [student1, student2],
        participants: [pupil2, pupil4, pupil5, pupil8, pupil10],
        lectures: { amount: 6, intervalInDays: 7, startOffsetInDays: -1 },
    });

    const [course3, subcourse3] = await createCourse({
        name: '🇩🇪 Deutsch Basics: Die ersten Schritte 🏃‍➡️',
        outline: 'Grammatikgrundlagen, einfache Satzstrukturen, erste Texte.',
        description:
            'Wir machen gemeinsam die ersten Schritte in der deutschen Sprache! 📖 Von den wichtigsten Grammatikregeln bis hin zu ersten kurzen Texten lernst du hier alles, was du für den Anfang brauchst. Mit vielen praktischen Übungen wirst du schnell Fortschritte machen und deine ersten Sätze stolz vortragen können! 💪',
        category: CourseCategory.language,
        subject: 'Deutsch_als_Zweitsprache',
        course_tags_course_tag: { create: { courseTagId: a1.id } },
        state: CourseState.submitted,
        allowContact: false,
        published: false,
        instructors: [student2],
        participants: [],
        lectures: { amount: 7, intervalInDays: 1, startOffsetInDays: 7 },
    });

    const [course4, subcourse4] = await createCourse({
        name: 'Englisch für Anfänger 🇬🇧',
        outline: 'Wortschatz, einfache Sätze, und grundlegende Grammatik.',
        description:
            "Let's speak English! 🗣️ In diesem Kurs lernst du die ersten Wörter und Sätze auf Englisch. Wir üben zusammen, sodass du bald erste Gespräche führen kannst. Mit Spielen und Liedern macht Englisch lernen besonders viel Spaß!",
        category: CourseCategory.revision,
        state: CourseState.allowed,
        subject: CourseSubject.Englisch,
        instructors: [student3],
        participants: [pupil1, pupil3, pupil5, pupil7],
        lectures: { amount: 3, intervalInDays: 1, startOffsetInDays: 4 },
    });

    const [course5, subcourse5] = await createCourse({
        name: 'Französisch für kleine Entdecker 🇫🇷',
        outline: 'Grundlagen der französischen Sprache, einfache Vokabeln, Sätze und Dialoge.',
        description:
            'Bienvenue! 🎨 Entdecke die Sprache der Croissants und Eiffeltürme! 🥐 In diesem Kurs lernst du die ersten Wörter und Sätze auf Französisch. Wir üben zusammen einfache Dialoge und lernen, wie man sich vorstellt oder sein Lieblingsessen beschreibt. Mit Liedern, Spielen und spannenden Geschichten wird das Französischlernen kinderleicht! 🌟 Bientôt, tu parleras français comme un pro! 😊',
        category: CourseCategory.revision,
        state: CourseState.allowed,
        subject: CourseSubject.Franz_sisch,
        instructors: [student3],
        participants: [pupil1, pupil3],
        lectures: { amount: 10, intervalInDays: 2, startOffsetInDays: 0 },
    });

    const [course6, subcourse6] = await createCourse({
        name: 'Mathematik: Grundlagen und Vertiefung 🔍',
        outline: 'Rechnen, Algebra, Geometrie und Problemlösungstechniken.',
        description:
            'In diesem Kurs lernst du die wichtigsten mathematischen Grundlagen und vertiefst dein Wissen in Bereichen wie Algebra, Geometrie und der Problemlösung. Mit gezielten Übungen und klaren Erklärungen bereiten wir dich optimal auf Prüfungen und den Schulalltag vor. Mathe verstehen und anwenden – für eine starke Basis! 📐',
        category: CourseCategory.revision,
        state: CourseState.allowed,
        subject: CourseSubject.Mathematik,
        instructors: [student2],
        participants: [pupil1, pupil3, pupil6, pupil7, pupil8, pupil9, pupil10],
        lectures: { amount: 5, intervalInDays: 7, startOffsetInDays: -2 },
    });

    const [course7, subcourse7] = await createCourse({
        name: 'Mathe-Abenteuer für die Mittelstufe',
        outline: 'Prozentrechnen, Geometrie, Algebra und Textaufgaben.',
        description:
            'Bist du bereit für ein Mathe-Abenteuer? 🏰 In diesem Kurs entdecken wir gemeinsam die Geheimnisse der Prozentrechnung, Geometrie und Algebra. Mit spannenden Aufgaben und kniffligen Rätseln wirst du Mathe bald mit ganz neuen Augen sehen! 🚀 Wer weiß, vielleicht wirst du zum Mathe-Meister? 👑',
        category: CourseCategory.revision,
        state: CourseState.allowed,
        subject: CourseSubject.Mathematik,
        instructors: [student4],
        participants: [pupil6, pupil7, pupil8, pupil9, pupil10],
        lectures: { amount: 4, intervalInDays: 1, startOffsetInDays: -3 },
    });

    const [course8, subcourse8] = await createCourse({
        name: 'Digitale Welt: Verstehen und Mitgestalten 🌐',
        outline: 'Internet, soziale Medien, digitale Sicherheit, und kreatives Arbeiten online.',
        description:
            'In der digitalen Welt gibt es viel zu entdecken! 🖥️ In diesem Kurs lernst du, wie das Internet funktioniert, wie du soziale Medien sicher nutzt und wie du eigene digitale Projekte umsetzen kannst. Wir sprechen über wichtige Themen wie Datenschutz, Fake News und digitale Kreativität. So wirst du fit für den sicheren Umgang mit der Online-Welt und kannst sie selbst mitgestalten! 🚀',
        category: CourseCategory.focus,
        state: CourseState.allowed,
        course_tags_course_tag: { create: { courseTagId: digitalWorld.id } },
        instructors: [student1],
        participants: [pupil1, pupil2, pupil3, pupil4, pupil5, pupil6, pupil7, pupil8, pupil9, pupil10],
        lectures: { amount: 5, intervalInDays: 1, startOffsetInDays: -1 },
    });

    const [course9, subcourse9] = await createCourse({
        name: 'Entscheidungen treffen: Wege zum Ziel 🎯',
        outline: 'Entscheidungsfindung, Problemlösung, Pro und Kontra abwägen.',
        description:
            'Wie treffe ich die richtige Entscheidung? 🤔 In diesem Kurs lernst du, wie man zwischen verschiedenen Möglichkeiten abwägt, Probleme strukturiert angeht und die besten Lösungen findet. Mit spannenden Übungen und Beispielen aus dem Alltag üben wir gemeinsam, Entscheidungen selbstbewusst zu treffen. So lernst du, deine Ziele zu erreichen und dich auch in schwierigen Situationen zurechtzufinden! 💡',
        category: CourseCategory.focus,
        state: CourseState.allowed,
        course_tags_course_tag: { create: { courseTagId: yourFuture.id } },
        maxParticipants: 5,
        instructors: [student1],
        participants: [pupil2, pupil3, pupil4, pupil5, pupil6],
        lectures: { amount: 7, intervalInDays: 1, startOffsetInDays: -1 },
    });

    const [course10, subcourse10] = await createCourse({
        name: 'Hausaufgabenhilfe',
        outline: 'Hausaufgabenhilfe',
        description:
            'Wenn du Hilfe bei deinen Schulaufgaben brauchst und dir Zuhause niemand helfen kann, dann helfen wir dir. Montag bis Donnerstag von 17-18 Uhr sind wir auf Zoom. \n\nBitte bringe deine Aufgaben mit, die du am Bildschirm zeigen kannst. \nZum Beispiel: \n- Deine Hausaufgaben \n- Übungsaufgaben für eine Klassenarbeit \n- Aufgaben, die du im Unterricht nicht verstanden hast',
        category: CourseCategory.homework_help,
        state: CourseState.allowed,
        maxParticipants: 1000,
        instructors: [student1, student2, student3, student5],
        participants: [pupil1, pupil2, pupil3, pupil5, pupil6, pupil7, pupil8, pupil9, pupil10],
        lectures: { amount: 15, intervalInDays: 7, startOffsetInDays: -14 },
    });

    await importAchievements();

    if (!process.env.SKIP_NOTIFICATION_IMPORT) {
        await importNotificationsFromProd();
        await importMessagesTranslationsFromProd();
    }

    _setSilenceNotificationSystem(false);

    logger.info(`Successfully seeded the DB`);
})();

function sha512(input: string): string {
    const hash = createHash('sha512');
    return hash.update(input).digest('hex');
}

const PROD_URL = 'https://api.lern-fair.de/apollo';

async function importNotificationsFromProd() {
    const existingNotifications = await getNotifications();
    if (existingNotifications.size) {
        throw new Error(`Cannot import from Prod as notifications exist`);
    }

    const prodNotifications = await (
        await fetch(PROD_URL, {
            body: JSON.stringify({
                query: `
                query {
                    notifications {
                        id
                        mailjetTemplateId
                        description
                        active
                        recipient
                        onActions
                        cancelledOnAction
                        type
                        delay
                        interval
                        sender
                        hookID
                        sample_context
                    }
                }`,
                variables: {},
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

    await importNotifications(prodNotifications.data.notifications, false, true);
    logger.info(`Imported notifications from productive landscape`, prodNotifications.data.notifications);
}

async function importMessagesTranslationsFromProd() {
    const prodMessageTranslations = await (
        await fetch(PROD_URL, {
            body: JSON.stringify({
                query: `
                    query {
                        notifications {
                            messageTranslations {
                                template
                                id
                                notificationId
                                navigateTo
                            }
                        }
                    }
                `,
                variables: {},
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

    const messageTranslations = prodMessageTranslations.data.notifications.reduce((acc: any[], cur: any) => [...acc, ...cur.messageTranslations], []);

    await importMessageTranslations(messageTranslations);
}
