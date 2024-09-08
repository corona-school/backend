/* eslint-disable comma-dangle */
import 'reflect-metadata';
import { createHash, randomBytes } from 'crypto';
import { getNotifications, importMessageTranslations, importNotifications } from './common/notification/notification';
import { _createFixedToken, createPassword, verifyEmail } from './common/secret';
import { userForStudent, userForPupil, refetchPupil, refetchStudent, userForScreener } from './common/user';
import { getLogger } from './common/logger/logger';
import { registerPupil } from './common/pupil/registration';
import { isDev, isTest } from './common/util/environment';
import { prisma } from './common/prisma';
import { becomeInstructor, becomeTutor, registerStudent } from './common/student/registration';
import { addInstructorScreening, addTutorScreening } from './common/student/screening';
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
} from '@prisma/client';
import { importAchievements } from './seed-achievements';

const logger = getLogger('DevSetup');

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

    const pupil1 = await registerPupil({
        firstname: 'Max',
        lastname: 'Musterschüler',
        email: 'test+dev+p1@lern-fair.de',
        aboutMe: "I'm Pupil1",
        newsletter: false,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bb',
        },
    });
    await verifyEmail(userForPupil(pupil1));
    await _createFixedToken(userForPupil(pupil1), `authtokenP1`);
    await createPassword(userForPupil(pupil1), `test`);
    await prisma.pupil.update({
        where: { id: pupil1.id },
        data: {
            languages: ['Bulgarisch', 'Italienisch'],
            subjects: JSON.stringify([{ name: 'Deutsch' }, { name: 'Mathematik' }, { name: 'Englisch' }]),
            learningGermanSince: 'less_than_one',
            grade: '3. Klasse',
        },
    });

    const pupil2 = await registerPupil({
        firstname: 'Tom',
        lastname: 'Müller',
        email: 'test+dev+p2@lern-fair.de',
        aboutMe: "I'm Pupil 2",
        newsletter: false,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bw',
        },
    });
    await verifyEmail(userForPupil(pupil2));
    await _createFixedToken(userForPupil(pupil2), `authtokenP2`);
    await prisma.pupil.update({
        where: { id: pupil2.id },
        data: {
            languages: [],
            subjects: JSON.stringify([{ name: 'Spanisch' }, { name: 'Deutsch' }]),
            grade: `6. Klasse`,
        },
    });

    const pupil3 = await registerPupil({
        firstname: 'Tom',
        lastname: 'Müller2',
        email: 'test+dev+p3@lern-fair.de',
        aboutMe: "I'm Pupil 3",
        newsletter: false,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bw',
        },
    });
    await verifyEmail(userForPupil(pupil3));
    await _createFixedToken(userForPupil(pupil3), `authtokenP3`);
    await createPassword(userForPupil(pupil3), `test`);
    await prisma.pupil.update({
        where: { id: pupil3.id },
        data: {
            subjects: JSON.stringify([{ name: 'Spanisch' }, { name: 'Deutsch' }]),
            grade: '6. Klasse',
        },
    });

    const pupil4 = await registerPupil({
        firstname: 'Jufi',
        lastname: 'Pufi',
        email: 'test+dev+p4@lern-fair.de',
        aboutMe: 'Im Pupil 4',
        newsletter: false,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bw',
        },
    });
    await verifyEmail(userForPupil(pupil4));
    await _createFixedToken(userForPupil(pupil4), `authtokenP4`);

    await prisma.pupil.update({
        where: { id: pupil4.id },
        data: {
            subjects: JSON.stringify([]),
            grade: '6. Klasse',
        },
    });

    const pupil5 = await registerPupil({
        firstname: 'Martin',
        lastname: 'Ulz',
        email: 'test+dev+p5@lern-fair.de',
        aboutMe: `I'm Pupil 5`,
        newsletter: false,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bb',
        },
    });
    await verifyEmail(userForPupil(pupil5));
    await _createFixedToken(userForPupil(pupil5), `authtokenP5`);
    await createPassword(userForPupil(pupil5), `test`);
    await prisma.pupil.update({
        where: { id: pupil5.id },
        data: {
            subjects: JSON.stringify([{ name: 'Deutsch' }, { name: 'Geschichte' }]),
            grade: '13. Klasse',
        },
    });

    const pupil6 = await registerPupil({
        firstname: 'Laurin',
        lastname: 'Ipsem',
        email: 'test+dev+p6@lern-fair.de',
        newsletter: false,
        aboutMe: `I'm Pupil6`,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bw',
        },
    });
    await verifyEmail(userForPupil(pupil6));
    await _createFixedToken(userForPupil(pupil6), `authtokenP6`);
    await prisma.pupil.update({
        where: { id: pupil6.id },
        data: {
            subjects: JSON.stringify([{ name: 'Englisch' }, { name: 'Latein' }]),
            grade: '10. Klasse',
        },
    });

    const pupil7 = await registerPupil({
        firstname: 'Lari',
        lastname: 'Fari',
        email: 'test+dev+p7@lern-fair.de',
        aboutMe: `I'm Pupil7`,
        newsletter: false,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bw',
        },
    });
    await verifyEmail(userForPupil(pupil7));
    await _createFixedToken(userForPupil(pupil7), `authtokenP7`);
    await createPassword(userForPupil(pupil7), `test`);
    await prisma.pupil.update({
        where: { id: pupil7.id },
        data: {
            subjects: JSON.stringify([{ name: 'Musik' }, { name: 'Latein' }]),
            grade: '7. Klasse',
        },
    });

    const pupil8 = await registerPupil({
        firstname: 'Max8',
        lastname: 'Musterschüler8',
        email: 'test+dev+p8@lern-fair.de',
        aboutMe: `I'm Pupil 8`,
        newsletter: false,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bw',
        },
    });
    await verifyEmail(userForPupil(pupil8));
    await _createFixedToken(userForPupil(pupil8), `authtokenP8`);
    await prisma.pupil.update({
        where: { id: pupil8.id },
        data: {
            subjects: JSON.stringify([{ name: 'Deutsch' }, { name: 'Mathematik' }, { name: 'Englisch' }]),
            grade: '3. Klasse',
            languages: ['Bulgarisch', 'Italienisch'],
            learningGermanSince: 'less_than_one',
        },
    });

    const pupil9 = await registerPupil({
        firstname: 'Max9',
        lastname: 'Musterschüler9',
        email: 'test+dev+p9@lern-fair.de',
        aboutMe: `I'm Pupil9`,
        newsletter: false,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bw',
        },
    });
    await verifyEmail(userForPupil(pupil9));
    await _createFixedToken(userForPupil(pupil9), `authtokenP9`);
    await createPassword(userForPupil(pupil9), `test`);
    await prisma.pupil.update({
        where: { id: pupil9.id },
        data: {
            subjects: JSON.stringify([{ name: 'Deutsch' }, { name: 'Mathematik' }, { name: 'Englisch' }]),
            grade: '3. Klasse',
            languages: ['Bulgarisch', 'Italienisch'],
            learningGermanSince: 'less_than_one',
        },
    });

    const pupil10 = await registerPupil({
        firstname: 'Max10',
        lastname: 'Musterschüler10',
        email: 'test+dev+p10@lern-fair.de',
        aboutMe: `I'm Pupil 10`,
        newsletter: false,
        registrationSource: 'normal',
        school: {
            name: 'MusterSchule',
            schooltype: 'grundschule',
            state: 'bw',
        },
    });
    await verifyEmail(userForPupil(pupil10));
    await _createFixedToken(userForPupil(pupil10), `authtokenP10`);
    await prisma.pupil.update({
        where: { id: pupil10.id },
        data: {
            subjects: JSON.stringify([{ name: 'Deutsch' }, { name: 'Mathematik' }, { name: 'Englisch' }]),
            grade: '3. Klasse',
            languages: ['Bulgarisch', 'Italienisch'],
            learningGermanSince: 'less_than_one',
        },
    });

    const screener1 = await prisma.screener.create({
        data: {
            firstname: 'Maxi',
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
            firstname: 'Chani',
            lastname: '',
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

    const student1 = await registerStudent({
        firstname: 'Leon',
        lastname: 'Jackson',
        email: 'test+dev+s1@lern-fair.de',
        aboutMe: `Im Student 1`,
        newsletter: false,
        registrationSource: 'normal',
    });
    await verifyEmail(userForStudent(student1));
    await _createFixedToken(userForStudent(student1), `authtokenS1`);
    await createPassword(userForStudent(student1), `test`);
    await createRemissionRequest(student1);
    // await createCoC(new Date(), new Date(), false, student1.id);
    await becomeTutor(student1, {
        languages: ['Bulgarisch', 'Italienisch'],
        subjects: [
            { name: 'Englisch', grade: { min: 1, max: 8 } },
            { name: 'Spanisch', grade: { min: 6, max: 10 } },
        ],
    });
    await addTutorScreening(screener1, student1, { success: true });
    await becomeInstructor(student1, {});
    await addInstructorScreening(
        screener1,
        student1,
        {
            success: true,
            comment: 'success',
        },
        false
    );

    const student2 = await registerStudent({
        firstname: 'Melanie',
        lastname: 'Meiers',
        aboutMe: `Im Student 2`,
        email: 'test+dev+s2@lern-fair.de',
        newsletter: false,
        registrationSource: 'normal',
    });
    await verifyEmail(userForStudent(student2));
    await _createFixedToken(userForStudent(student2), `authtokenS2`);
    await createPassword(userForStudent(student2), `test`);
    await becomeTutor(student2, {
        languages: [],
        subjects: [
            { name: 'Deutsch', grade: { min: 3, max: 5 } },
            { name: 'Mathematik', grade: { min: 4, max: 6 } },
        ],
    });
    await addTutorScreening(screener1, student2, { success: true });
    await becomeInstructor(student2, {});
    await addInstructorScreening(screener1, student2, { success: true }, false);
    await prisma.student.update({
        where: { id: student2.id },
        data: { zoomUserId: 'kLKyaiAyTNC-MWjiWCFFFF' },
    });

    const student3 = await registerStudent({
        firstname: 'Leon',
        lastname: 'Erath',
        email: 'test+dev+s3@lern-fair.de',
        aboutMe: `I'm Student 3`,
        newsletter: false,
        registrationSource: 'normal',
    });
    await verifyEmail(userForStudent(student3));
    await _createFixedToken(userForStudent(student3), `authtokenS3`);
    await createPassword(userForStudent(student3), `test`);
    await becomeTutor(student3, {
        languages: [],
        subjects: [
            { name: 'Englisch', grade: { min: 1, max: 8 } },
            { name: 'Spanisch', grade: { min: 6, max: 10 } },
        ],
    });
    await addTutorScreening(screener1, student3, { success: true });

    await createPupilMatchRequest(await refetchPupil(pupil1));
    await createStudentMatchRequest(await refetchStudent(student1));
    await createMatch(await refetchPupil(pupil1), await refetchStudent(student1), TEST_POOL);

    await createPupilMatchRequest(await refetchPupil(pupil2));
    await createStudentMatchRequest(await refetchStudent(student1));
    await createMatch(await refetchPupil(pupil2), await refetchStudent(student1), TEST_POOL);

    const signature = Buffer.from(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATwAAACdCAMAAAAe7DTLAAADAFBMVEX//' +
            '//IyMh/f382NjYAAAAAAAAAAAAAAABnAHIAYQBmACAAMQAuAGcAaQBmAAAAEgAjcddagg8Etb4OBPJA' +
            'BhQAAAAAAMj4EgBwjdR3ZNDZd8j4EgAAABQAqET5dyQAAABIDRQAAAAUACglFQCg+BIAmPkSA' +
            'Oj6EgDwiPp3cDj1d/////+oRPl3cH31dzqK9XcAAAAAAAAAAKhzSABoaTkA0mnXWoIPBLXE+RIAAAAA' +
            'AMtE+XfAbBgAzYv1d3gHFAA3kPV36GwYAMhsGACkbBgAAwAAAAT7EgDwBXgAPPkSAD+I1HfwBBQAkGw' +
            'YAIAAAAANAAAA8AQUAIhsGAANAAAAaAAAALOb9XeAbBgAJAACAKD8FAAw+hIAAAAAAMtE+Xc8+hIAAA' +
            'AAAMtE+XeIbBgAzYv1d9gHFAA3kPV3pGwYAJBsGAAAAAAAqHNIAAUAAAAoAAAAAAAAAAAAAABUAAAAi' +
            'GwBAAAAFAAI+RIAaAEUAPD5EgDwiPp3iBz1d/////83kPV3VpT2d3GU9nfgRfx3ZJT2d+hsGADIbBgA' +
            'pGwYAADg/X/Y+RIAVAAAADT6EgDwiPp3IBb1d/////9klPZ3hJ32dwcAAAA4AAAAkGwYAAAAAAAYYhg' +
            'AuEgBAAAAFACA+RIAAAAAAID6EgDwiPp3iBz1d/////83kPV3dO7ndwAAFAAAAAAAgO7nd4C71HcAAA' +
            'AABQAAAEEAVQAA4P1/RwBSAAAAAAAAAAAALAEAAJBsGABQ+hIAXPoSALD/EgDlsul3aHvpd/////+A7' +
            'ud33E1DAJBsGACAu9R3AAAAACAAAAAY54XbfHHDAXJJiNt8ccMBGhC31CQAAAAgAQAAQO8AAAEAAAAm' +
            '7dR3AAAAAGdyYQAoJRUAAAAUANT4EgABAAAANPsSAPCI+nd4HPV3/////zqK9Xcnpud3AAAUAAgAFAA' +
            '4pud3gLvUdwAAAAAAAAAAAAAAAAAAAADEwEQATyUVAMTmFgBTJRUA03NIAP////8oJRUALsFEAE8lFQ' +
            'BKCzIbAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAL90lEQVR4nO1di7KrKgxtEv//m3clPAIEBATbul1zZ' +
            '+7ZrSIu8yIJ9vV68ODBgwcP/i+AABAJPj2PX8ObtM0DPz2bL8GbFIQDUUIiwxltROafdM3cvgDwvvcS' +
            'O8Cs1NgAK3HkxA3/D3lIFXLIK+IBu4F988H/MHpYFazAnX6AZS5YONgfxVtzV0z128A3TyXzDuZbKng' +
            'AJ3P+K8Pc9l9cLVape72suqrcWUuH/k86so2/jD3+2rH/D3fpMJJToW5n7S1G8FK5M8yBGzlxGXcCUD' +
            'BezobxDddVbNteLGLpYWiFDiAQd0t1lcyxNfd/HwkKvY/YuUlH5HMBw5NYNfmPAoTICdng+z60T6DYs' +
            'WghcVuJe+sU+RvE5A7ReNFDgYEgW/sYQWiJzKC35O0V4n41dCDrRQ/YQ1bP1GLeVEsdXOCwpRLH3zJ3' +
            'lsLyIEJl31Js5AwbLOVPw2uryhyrLNh/lMnjQAZipvDeMbDTsczKhSO8ONXIQ03h773ixyPmJAFQVls' +
            'zTqaed5a7qp1zoCA8lEdwDGns5Pj3NXfOu1apA8GdvmT1xi77nG6rs1mGQ0XkK0EXPLfySnHbLB2mab' +
            'XCYdH9qxavmFTCm3KXZSQLoIgWUM4o51nglty5cLhq6gySOIPy9X4lz0J3dBbQyFzGXeY6q7mCxY52L' +
            '9AtHF4HS10LdamvhJQnzPMn0ZcLHW2r2Zl6TbcIazk4EZ3MhFVrGWudhc86ZN+ASX0vuLJbwLY9L8zk' +
            'LjqRFxTFWZZF8jRkbjD9yqe/Jl8TytkmDZTLnZhRKSp2WCd4IoOhm5EF7GV15uM5ptyJv+GoPWKVPZI' +
            'SkASdthCP8EZpETl2TepiLpWzlDs1fSKxSmmt2IGdE2Vf8SSnkheXS4+h+QaM/qoPtkhpITLZsRmR4R' +
            'dOfHbYp7AvTWflMuNwtZ/6lkmI74PkJFCGX6najMMV6XsEIeEudrsNUlXMW51CrD7RnGLvRX2SUkanm' +
            '3DneO4waTqBhpnN1JoACNYuXWRTFG7OWtnERqIRzomBEjQ11XLU4PU0SHCHGXf+j2Oj0gjslzpvr97q' +
            'zt0VCIGKJoVY4i0iucu4C89qVqUuul4z+MG9he7Nkq0/uEEa/cASbyGXE5nrF1Zl0sVL2d06zGOE9+I' +
            'QLIHevsBhgBKuO1vwogIJpb4i5m7CtcfEjvPm8J4cOOqckrT6/3lxQjymL99FtwURd5N0dkzsbM0BYg' +
            '9N9rM249kon93TUrmLV2hzKiY4JnbgGMeoHWdPHze7fxi6ch2CuyzkpCXcDaiOvtg3utDssxdwJ+5mK' +
            '7tZ6A8sFMBAaGdQiG23nkexYGFG3s8mKht5pjmNCbUNEocnKudB16OYX+T210+j30hLp1x30Mm+rK4r' +
            'n3dZkvlhSrDDyTOU85qzqhi1dvZMvaOxfbz5hVrPXbq2kZeaqLJDJqfQptPpwaYXan3COn2Ggrs5wV2' +
            'JgPFTOwV5vuDZVFNmDcKVTMvbpABlcBjdWfQa0NmCxz0w2prFC9sc6krOsgWFVWu1pK0NM5k74NgJKL' +
            'NoTokn+fZTgb3Ou6y1tA7zgpn0Gf9f2Er0mhdTjnuKVyE4NmvZLu5cn+TgLHKYZ6q0+3JprHmx3XSZq' +
            'XJn1rIHuwYE9v1922Tywj6OpKNjN627Ls+50qlERsIdvO2v2bODHbUAtw3PJLMmwXeZp/vYRqoy1cuM' +
            'DyW5c/uGLRX6iqM0CCf95sqdmViy8jkoLXQSccrlyGyPty+73PnehcaBxCQqb27omhfbjCRMLwdkJmT' +
            'BLmU+l7gN3AnLDGZ25oNmexDM42EXS4Y8UINoXpKrrFXLPV10lqYn5pjDnXRdzB1nHaFx2Si463Qbmi' +
            'SxCX1ZO5KU38XB/GIWL58WrVeeoLPu2nKzAIgmmsqOn2gg9Gej2hOa8eAOzwJxdPFl1gAY1Rb8ZrkwT' +
            'N9jO5fz9gGObDdCfnQiND1mT9BCVuM3QDB8GUPkew79KfwVsxNJi+QhuXC00nbHEQy25Z0LsSO7EiZo' +
            '6JRhPSTPXxsoyG1yL/upgg+RCNm/MvcuyZN7zNNFK23C/lGgzuhGv+Cd0VmRIAaRVfQmMCkVVFbfmTq' +
            '6G7MxWiZJ9t0i7oNNyi1HSNyrkOagKFxJxnpmazQ/ij7uhltCZHKdpC64iRaOzQfKuDOrPZQSspfQg2' +
            'OwIT06nuJqNvh2Dzmuiz99Z56nDp2hgC5Pe6ZVP3pKWetROnCl6ykPZqQd9iEH+NqWJ3t/ZFYexZyEK' +
            'UrsGwbr4h2dDQZ4TGeb93Z4PHqVQQ/RCaK1sLdvQP628hSQLnr505Zxp7CWJIo4Tv5AdsK6Rl1PpjeF' +
            'SN4t+K4PFxF4f0EuXeDX2NmSOJnkIHdJGOvJC9xlp+jWVdEUKaThW1egCXLKZIKv3LhvQnRil7RB3Tc' +
            'XBfMn3vdauURnL816GLEWqw9nbSFNX4G3RZY7xZCqDdIYBEvMSnJH4dMt6ou05tp1rXtShc4bMkIkag' +
            '3dPoB3KwhidOuGgraW47hhg6d0YrgSS0Fn+TQ90Zx8KrlzMuX3Q4tn5qfgMl/uokldR1qXWOW3wBLwh' +
            'h9lK1ruzOQNdyMTOzsX5OhWS3lXRkoOBSknNiaDoE3+cOG9rRKG24a5ncUqe+1pSolga+OPvdnOdubV' +
            'RkrvLKrAhfIDG3kCr+DSpVi655bc4jlpOfLBXhQ1yaSGVrWBNO8bVy8reeUoCdGe8xqDIiua+T5CbR+' +
            'LXyc1cAeFbGS8KQjrscJlyH3DgODZfsXCt2bZ2GQKgErjJOkX+MBOYgV5mKBGE7URXFq4eAVqys9gUf' +
            'F5mK5JXYMsJOjcpCH3CRbABxw4t4GdRJ9HtrJskJH47LKxswAjTlQWziPZ/VrYCDqggzyfEmo6wWqlE' +
            'K498nRvIf8xmWNk994c5DnqOrbZ+lzcFmF1RLEMmXdTujc0eOq6rmb2X4jXq9K+b7prhG9CnmtvchhN' +
            'tq5+4R8mzSHtNiikOKID5jeO/CiUVFq1diHqBv+dOkXwQgpVgcij3kDrzkK1+GA9YESPyEDnrzj+lyi' +
            'UhMiHFDYMk6HFQ5xBpegXV9ZFRPYwx6j3t1NO3CNzDrXX+vEB9udOdt1dH5SB+UEp858DMGyP2Dc9OG' +
            'hRwvWcmReqIWEu57rVcLQuntbBnLF9j+sC7D/4YX5EIGKGeOlmkfiphEVzOBm5vHatYib2IT0AubLlJ' +
            'Mv+X4UBVl5zBO4yqjLKv4Oz3LZgVOq9EADyxk8ZUubbMKlRieZXhcwF5vk4P/urs46AgbcFFsv9DFNR' +
            'x+lUWG+eui8OXyx1YTW8PNixzho4us8J3c0k8nf7VFTZd2aEbURsY67WV9fX8MHFMDNREks7vZLYesm' +
            '9fPr+ZZjfE6WBDSaLXPofYiPc8GpfLifKzH3m4q3gQNx0jZFp52Hv/umEW9+bKy6FsY0VZWbg5xakX/' +
            'i7qCYcLBDGkaS2pP8Eh+bKl181BXsL5bcRKTQ3RuTwSjpb/VzrMVa8b6xzBpogMRXuvVtVRviH/Egye' +
            'Mm8X6te7XkItvYF2mjIe2IU662YdH7Jy8kDgFw7jZztVutUzAGi8HWJ+p7ZBdMJQFQyBrNXBL7h4QLp' +
            'K26vmAajoZhkrvZW/2WxZeMvG51HbavCaehhxQXLz3of5zysuAq4HSQZa3hVhrLYvToVg28WLcDQli1' +
            'J9xz+1THs+MvcenDeQICVNCW59MFOoWvWnTRsIOzCINfP7YJS3iGuScbbu+94SvDS1+tkzNqXVCBPvA' +
            '6v6zLYuGfCJoIEXWaHD68pv0DYYpx5IV4XlNBStCWbIk2moPTxfNoB1gexFuLHG0ztYHcBaKtfViWDc' +
            'iY939+KK9MesuyYZ8C52r3XXZT373wpjGG5EPGigPssDK6cxCxcuHIX+GBNZSY+Q95N8JB3Ag95J3Ch' +
            't70dFvw+wv/B95VVfwhXh3l3wodKg/fA0hLD3XFVUuWOeLR2HPC4i3E8Fm8cD3fjuCwFf0PMrUb/L2i' +
            'vCHzQiGuKjvfE5/tdfxePsxgG96g83I3g8RXDgGu6e24Jbml8uBsA0EPdIMrvgX1wiEdjT+Bxsidwh9' +
            '6aBw8ePHjw4PfxB1+DS8VZrR4OAAAAAElFTkSuQmCC',
        'utf-8'
    );

    await prisma.participation_certificate.create({
        data: {
            uuid: randomBytes(5).toString('hex').toUpperCase(),
            pupilId: pupil1.id,
            studentId: student1.id,
            subjects: 'Englisch,Deutsch',
            certificateDate: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            categories: 'test',
            hoursTotal: 8,
            medium: 'PC',
            hoursPerWeek: 8,
            // state: old, before automatic process, shall default to "manual"
        },
    });

    await prisma.participation_certificate.create({
        data: {
            uuid: randomBytes(5).toString('hex').toUpperCase(),
            pupilId: pupil1.id,
            studentId: student1.id,
            subjects: 'Englisch,Deutsch',
            certificateDate: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            categories: 'test',
            hoursTotal: 8,
            medium: 'PC',
            hoursPerWeek: 8,
            state: 'awaiting-approval',
        },
    });

    await prisma.participation_certificate.create({
        data: {
            uuid: randomBytes(5).toString('hex').toUpperCase(),
            pupilId: pupil1.id,
            studentId: student1.id,
            subjects: 'Englisch,Deutsch',
            certificateDate: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            categories: 'xyzipd',
            hoursTotal: 8,
            medium: 'PC',
            hoursPerWeek: 8,
            state: 'awaiting-approval',
        },
    });

    await prisma.participation_certificate.create({
        data: {
            uuid: randomBytes(5).toString('hex').toUpperCase(),
            pupilId: pupil1.id,
            studentId: student1.id,
            subjects: 'Englisch,Deutsch',
            certificateDate: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            categories: 'xyzipd',
            hoursTotal: 8,
            medium: 'PC',
            hoursPerWeek: 8,
            state: 'approved',
            signatureParent: signature,
        },
    });

    await prisma.participation_certificate.create({
        data: {
            uuid: randomBytes(5).toString('hex').toUpperCase(),
            pupilId: pupil1.id,
            studentId: student1.id,
            subjects: 'Englisch,Deutsch',
            certificateDate: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            categories: 'xyzipd',
            hoursTotal: 8,
            medium: 'PC',
            hoursPerWeek: 8,
            state: 'awaiting-approval',
        },
    });

    const mint = await createCourseTag(null, 'MINT', CourseCategory.focus);
    const music = await createCourseTag(null, 'Musik', CourseCategory.focus);

    const course1 = await prisma.course.create({
        data: {
            name: 'Grundlagen der Physik',
            outline: 'E(m) = m * c * c',
            description:
                'Es gibt zwei Dinge, die sind unendlich. Das Universum und die menschliche Dummheit. Obwohl, bei dem einen bin ich mir nicht so sicher.',
            category: CourseCategory.focus,
            course_tags_course_tag: { create: { courseTagId: mint.id } },
            courseState: CourseState.submitted,
        },
    });
    await addCourseInstructor(null, course1, student1);
    await addCourseInstructor(null, course1, student2);

    const course2 = await prisma.course.create({
        data: {
            name: 'COBOL und ABAP - Eine Reise in die Steinzeit der Informatik',
            outline: 'Mit lebenden Exemplaren zum anschauen',
            description: 'COBOL und ABAP prägen unser Leben wie kaum andere Programmiersprachen - Und doch kennt sie kaum jemand.',
            category: CourseCategory.club,
            course_tags_course_tag: { create: { courseTagId: mint.id } },
            courseState: CourseState.allowed,
            allowContact: true,
        },
    });
    await addCourseInstructor(null, course2, student1);

    const course3 = await prisma.course.create({
        data: {
            name: 'Grundlagen der Mathematik',
            outline: '(0 + 1) * a = a * 0 + 1 * a => a * 0 = 0',
            description: 'Hinter=den einfachsten Aussagen steckt viel mehr Logik, als man eigentlich erwartet ...',
            category: CourseCategory.revision,
            course_tags_course_tag: { create: { courseTagId: mint.id } },
            courseState: CourseState.denied,
            subject: CourseSubject.Mathematik,
        },
    });
    await addCourseInstructor(null, course3, student1);
    await addCourseInstructor(null, course3, student2);

    const course4 = await prisma.course.create({
        data: {
            name: 'KIZ, 187, Aligatoah.',
            outline: 'Die Musik des neuen Jahrtausends',
            description: 'Eine=musikalische Reise zu den melodischen Klängen der neuen Musikgenres.',
            category: CourseCategory.revision,
            course_tags_course_tag: { create: { courseTagId: music.id } },
            courseState: CourseState.cancelled,
            subject: CourseSubject.Musik,
        },
    });
    await addCourseInstructor(null, course4, student1);

    const course5 = await prisma.course.create({
        data: {
            name: 'Gitarre lernen für Anfänger',
            outline: 'Mit 3 Akkorden zum ersten Song',
            description: 'In diesem Kurs lernst du das Instrument und 3 einfache Akkorde kennen, mit denen du einen ganzen Song spielen kannst!',
            category: CourseCategory.club,
            course_tags_course_tag: { create: { courseTagId: music.id } },
            courseState: CourseState.allowed,
            subject: CourseSubject.Musik,
        },
    });
    await addCourseInstructor(null, course5, student1);
    await addCourseInstructor(null, course5, student2);

    const subcourse1 = await prisma.subcourse.create({
        data: {
            courseId: course1.id,
            joinAfterStart: true,
            minGrade: 1,
            maxGrade: 13,
            maxParticipants: 4,
            published: false,
        },
    });

    const subcourse2 = await prisma.subcourse.create({
        data: {
            courseId: course2.id,
            joinAfterStart: true,
            minGrade: 3,
            maxGrade: 10,
            maxParticipants: 5,
            published: true,
        },
    });

    const subcourse3 = await prisma.subcourse.create({
        data: {
            courseId: course3.id,
            joinAfterStart: false,
            minGrade: 10,
            maxGrade: 11,
            maxParticipants: 3,
            published: true,
        },
    });

    const subcourse4 = await prisma.subcourse.create({
        data: {
            courseId: course4.id,
            joinAfterStart: false,
            minGrade: 8,
            maxGrade: 11,
            maxParticipants: 10,
            published: true,
        },
    });

    const subcourse5 = await prisma.subcourse.create({
        data: {
            courseId: course5.id,
            joinAfterStart: true,
            minGrade: 3,
            maxGrade: 10,
            maxParticipants: 10,
            published: true,
        },
    });

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    {
        // The first course has a lot of lectures to better test joining course meetings
        let currentLecture = Date.now();
        const endLectures = Date.now() + 24 * 60 * 60 * 1000;
        while (currentLecture < endLectures) {
            await prisma.lecture.create({
                data: {
                    subcourseId: subcourse2.id,
                    duration: 15,
                    start: new Date(currentLecture),
                    organizerIds: [],
                    participantIds: [],
                    appointmentType: AppointmentType.group,
                },
            });

            currentLecture += 60 * 60 * 1000;
        }
    }

    await prisma.lecture.create({
        data: {
            subcourseId: subcourse1.id,
            duration: 120,
            start: new Date(year, month, date + 10, 19, 0, 0, 0),
            organizerIds: [],
            participantIds: [],
            appointmentType: AppointmentType.group,
        },
    });

    await prisma.lecture.create({
        data: {
            subcourseId: subcourse1.id,
            duration: 120,
            start: new Date(year, month, date + 14, 21, 0, 0, 0),
            organizerIds: [],
            participantIds: [],
            appointmentType: AppointmentType.group,
        },
    });

    await prisma.lecture.create({
        data: {
            subcourseId: subcourse1.id,
            duration: 120,
            start: new Date(year, month, date, 4, 0, 0, 0),
            organizerIds: [],
            participantIds: [],
            appointmentType: AppointmentType.group,
        },
    });

    await prisma.lecture.create({
        data: {
            subcourseId: subcourse1.id,
            duration: 60,
            start: new Date(year, month, date, hours, minutes - 1, 0, 0),
            organizerIds: [],
            participantIds: [],
            appointmentType: AppointmentType.group,
        },
    });

    await prisma.lecture.create({
        data: {
            subcourseId: subcourse3.id,
            duration: 90,
            start: new Date(year, month, date + 5, 10, 0, 0, 0),
            organizerIds: [],
            participantIds: [],
            appointmentType: AppointmentType.group,
        },
    });

    await prisma.lecture.create({
        data: {
            subcourseId: subcourse4.id,
            duration: 120,
            start: new Date(year, month, date + 15, 11, 0, 0, 0),
            organizerIds: [],
            participantIds: [],
            appointmentType: AppointmentType.group,
        },
    });

    await prisma.lecture.create({
        data: {
            subcourseId: subcourse5.id,
            duration: 120,
            start: new Date(year, month, date + 15, 11, 0, 0, 0),
            organizerIds: [],
            participantIds: [],
            appointmentType: AppointmentType.group,
        },
    });

    await importAchievements();

    // Add Instructors and Participants after adding Lectures, so that they are also added to the lectures:
    await addSubcourseInstructor(null, subcourse1, student1);
    await addSubcourseInstructor(null, subcourse1, student2);

    await addSubcourseInstructor(null, subcourse2, student1);
    await joinSubcourse(subcourse2, pupil1, false);
    await joinSubcourse(subcourse2, pupil2, false);
    await joinSubcourse(subcourse2, pupil3, false);
    await joinSubcourse(subcourse2, pupil4, false);
    await joinSubcourse(subcourse2, pupil5, false);
    await joinSubcourseWaitinglist(subcourse2, pupil6);
    await joinSubcourseWaitinglist(subcourse2, pupil7);

    await addSubcourseInstructor(null, subcourse3, student1);
    await addSubcourseInstructor(null, subcourse3, student2);
    await joinSubcourse(subcourse3, pupil1, false);
    await joinSubcourse(subcourse3, pupil2, false);
    await joinSubcourse(subcourse3, pupil3, false);

    await addSubcourseInstructor(null, subcourse4, student2);

    await addSubcourseInstructor(null, subcourse5, student1);
    await addSubcourseInstructor(null, subcourse5, student2);
    await joinSubcourse(subcourse5, pupil1, false);
    await joinSubcourse(subcourse5, pupil2, false);
    await joinSubcourse(subcourse5, pupil3, false);
    await joinSubcourse(subcourse5, pupil4, false);
    await joinSubcourse(subcourse5, pupil5, false);
    await joinSubcourse(subcourse5, pupil6, false);
    await joinSubcourse(subcourse5, pupil7, false);
    await joinSubcourse(subcourse5, pupil8, false);
    await joinSubcourse(subcourse5, pupil9, false);
    await joinSubcourse(subcourse5, pupil10, false);

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
