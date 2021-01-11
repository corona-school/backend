/* eslint-disable comma-dangle */
import { getConnection, getManager } from "typeorm";
import { createHash, randomBytes } from "crypto";
import { Pupil } from "../common/entity/Pupil";
import { Student } from "../common/entity/Student";
import { Match } from "../common/entity/Match";
import { Screener } from "../common/entity/Screener";
import { Screening } from "../common/entity/Screening";
import { ParticipationCertificate } from "../common/entity/ParticipationCertificate";
import { hashPassword } from "../common/util/hashing";
import { CourseTag } from "../common/entity/CourseTag";
import { Course, CourseCategory, CourseState } from "../common/entity/Course";
import { Subcourse } from "../common/entity/Subcourse";
import { Lecture } from "../common/entity/Lecture";
import { InstructorScreening } from "../common/entity/InstructorScreening";
import { CourseAttendanceLog } from "../common/entity/CourseAttendanceLog";
import { Division, Expertise, Mentor } from "../common/entity/Mentor";
import { School } from "../common/entity/School";
import { State } from "../common/entity/State";
import { SchoolType } from "../common/entity/SchoolType";
import { ProjectField } from "../common/jufo/projectFields";
import {
    TuteeJufoParticipationIndication,
    TutorJufoParticipationIndication,
} from "../common/jufo/participationIndication";
import { ProjectMatch } from "../common/entity/ProjectMatch";
import { ProjectCoachingScreening } from "../common/entity/ProjectCoachingScreening";
import { ExpertData } from "../common/entity/ExpertData";
import { ExpertiseTag } from "../common/entity/ExpertiseTag";
import { ExpertAllowedIndication } from "../common/jufo/expertAllowedIndication";

export async function setupDevDB() {
    const conn = getConnection();
    await conn.synchronize(true);

    const entityManager = getManager();

    const pupils: Pupil[] = [];

    let p = new Pupil();
    p.firstname = "Max";
    p.lastname = "Musterschüler";
    p.active = true;
    p.isPupil = true;
    p.email = "max@gamil.com";
    p.verification = null;
    p.verifiedAt = new Date(new Date().getTime() - 100000);
    p.authToken = sha512("authtokenP1");
    p.wix_id = "00000000-0000-0001-0001-1b4c4c526364";
    p.wix_creation_date = new Date(new Date().getTime() - 10000000);
    p.subjects = JSON.stringify(["Deutsch", "Mathematik", "Englisch"]);
    p.grade = "3. Klasse";
    p.openMatchRequestCount = 0;
    pupils.push(p);

    p = new Pupil();
    p.firstname = "Tom";
    p.lastname = "Müller";
    p.active = true;
    p.email = "müller@hotmail.de";
    p.verification = null;
    p.verifiedAt = new Date(new Date().getTime() - 200000);
    p.authToken = sha512("authtokenP2");
    p.wix_id = "00000000-0000-0001-0002-1b4c4c526364";
    p.wix_creation_date = new Date(new Date().getTime() - 20000000);
    p.subjects = JSON.stringify(["Spanisch", "Deutsch"]);
    p.grade = "6. Klasse";
    p.openMatchRequestCount = 0;
    pupils.push(p);

    p = new Pupil();
    p.firstname = "Tom";
    p.lastname = "Müller2";
    p.isParticipant = true;
    p.isPupil = false;
    p.active = true;
    p.email = "müller2@hotmail.de";
    p.verification = null;
    p.verifiedAt = new Date(new Date().getTime() - 200000);
    p.authToken = sha512("authtokenP3");
    p.wix_id = "00000000-0000-0001-0002-1b4c4c526365";
    p.wix_creation_date = new Date(new Date().getTime() - 20000000);
    p.subjects = JSON.stringify(["Spanisch", "Deutsch"]);
    p.grade = "6. Klasse";
    p.openMatchRequestCount = 0;
    pupils.push(p);

    p = new Pupil();
    p.firstname = "Jufi";
    p.lastname = "Pufi";
    p.isParticipant = false;
    p.isPupil = false;
    p.active = true;
    p.isJufoParticipant = TuteeJufoParticipationIndication.YES;
    p.isProjectCoachee = true;
    p.projectFields = [ProjectField.ARBEITSWELT, ProjectField.BIOLOGIE];
    p.email = "jjifi@hotmail.de";
    p.verification = null;
    p.verifiedAt = new Date(new Date().getTime() - 200000);
    p.authToken = sha512("authtokenP4");
    p.wix_id = "00000000-0000-0001-0002-1b4c4c526367";
    p.wix_creation_date = new Date(new Date().getTime() - 20000000);
    p.subjects = JSON.stringify([]);
    p.grade = "6. Klasse";
    p.openMatchRequestCount = 0;
    pupils.push(p);

    for (let i = 0; i < pupils.length; i++) {
        await entityManager.save(Pupil, pupils[i]);
        console.log("Inserted Dev Pupil " + i);
    }
    const students: Student[] = [];

    const s1 = new Student();
    s1.firstname = "Leon";
    s1.lastname = "Jackson";
    s1.active = true;
    s1.email = "leon-jackson@t-online.de";
    s1.isInstructor = true;
    s1.isStudent = true;
    s1.verification = null;
    s1.verifiedAt = new Date(new Date().getTime() - 110000);
    s1.authToken = sha512("authtokenS1");
    s1.wix_id = "00000000-0000-0002-0001-1b4c4c526364";
    s1.wix_creation_date = new Date(new Date().getTime() - 11000000);
    s1.subjects = JSON.stringify([
        { name: "Englisch", minGrade: 1, maxGrade: 8 },
        { name: "Spanisch", minGrade: 6, maxGrade: 10 },
    ]);
    s1.openMatchRequestCount = 1;
    s1.isProjectCoach = true;
    students.push(s1);

    const s2 = new Student();
    s2.firstname = "Melanie";
    s2.lastname = "Meiers";
    s2.active = true;
    s2.email = "mel-98@gmail.com";
    s2.isInstructor = true;
    s2.isStudent = true;
    s2.verification = null;
    s2.verifiedAt = new Date(new Date().getTime() - 220000);
    s2.authToken = sha512("authtokenS2");
    s2.wix_id = "00000000-0000-0002-0002-1b4c4c526364";
    s2.wix_creation_date = new Date(new Date().getTime() - 22000000);
    s2.subjects = JSON.stringify(["Deutsch3:5", "Mathematik4:6"]);
    s2.openMatchRequestCount = 2;
    students.push(s2);

    const s3 = new Student();
    s3.firstname = "Leon";
    s3.lastname = "Erath";
    s3.active = true;
    s3.email = "leon-erath@test.de";
    s3.isInstructor = true;
    s3.isStudent = true;
    s3.verification = null;
    s3.verifiedAt = new Date(new Date().getTime() - 110000);
    s3.authToken = sha512("authtokenS3");
    s3.wix_id = "00000000-0000-0002-0001-1b4c4c5263123";
    s3.wix_creation_date = new Date(new Date().getTime() - 11000000);
    s3.subjects = JSON.stringify([
        { name: "Englisch", minGrade: 1, maxGrade: 8 },
        { name: "Spanisch", minGrade: 6, maxGrade: 10 },
    ]);
    s3.openMatchRequestCount = 1;
    students.push(s3);

    const s4 = new Student();
    s4.firstname = "Leon2";
    s4.lastname = "Erath2";
    s4.active = true;
    s4.email = "leon-erath@test.de2";
    s4.isInstructor = true;
    s4.isStudent = false;
    s4.verification = null;
    s4.verifiedAt = new Date(new Date().getTime() - 110000);
    s4.authToken = sha512("authtokenS4");
    s4.wix_id = "00000000-0000-0002-0001-1b4c4c5263126";
    s4.wix_creation_date = new Date(new Date().getTime() - 11000000);
    s4.subjects = JSON.stringify([
        { name: "Englisch", minGrade: 1, maxGrade: 8 },
        { name: "Spanisch", minGrade: 6, maxGrade: 10 },
    ]);
    s4.openMatchRequestCount = 1;
    students.push(s4);

    const s5 = new Student();
    s5.firstname = "Leon5";
    s5.lastname = "Erath5";
    s5.active = true;
    s5.email = "leon-erath@test.de5";
    s5.isInstructor = false;
    s5.isStudent = true;
    s5.verification = null;
    s5.verifiedAt = new Date(new Date().getTime() - 110000);
    s5.authToken = sha512("authtokenS5");
    s5.wix_id = "00000000-0000-0002-0001-1b4c4c5263213132";
    s5.wix_creation_date = new Date(new Date().getTime() - 11000000);
    s5.subjects = JSON.stringify([
        { name: "Englisch", minGrade: 1, maxGrade: 8 },
        { name: "Spanisch", minGrade: 6, maxGrade: 10 },
    ]);
    s5.openMatchRequestCount = 1;
    students.push(s5);

    const s6 = new Student();
    s6.firstname = "Jufo";
    s6.lastname = "Tufo";
    s6.active = true;
    s6.email = "jufo-tufo@test.de";
    s6.isInstructor = false;
    s6.isProjectCoach = true;
    s6.isStudent = false;
    await s6.setProjectFields([
        { name: ProjectField.ARBEITSWELT, min: 1, max: 13 },
    ]);
    s6.wasJufoParticipant = TutorJufoParticipationIndication.YES;
    s6.isUniversityStudent = false;
    s6.hasJufoCertificate = false;
    s6.jufoPastParticipationConfirmed = true;
    s6.verification = null;
    s6.verifiedAt = new Date(new Date().getTime() - 110000);
    s6.authToken = sha512("authtokenS6");
    s6.wix_id = "00000000-0000-0002-0001-1b4c4c52632131096";
    s6.wix_creation_date = new Date(new Date().getTime() - 11000000);
    s6.subjects = JSON.stringify([]);
    s6.openMatchRequestCount = 1;
    students.push(s6);

    const s7 = new Student();
    s7.firstname = "Jufo";
    s7.lastname = "Mufo";
    s7.active = true;
    s7.email = "jufo-mufo@test.de5";
    s7.isInstructor = false;
    s7.isStudent = true;
    s7.isProjectCoach = true;
    s7.verification = null;
    await s7.setProjectFields([{ name: ProjectField.CHEMIE, min: 1, max: 13 }]);
    s7.verifiedAt = new Date(new Date().getTime() - 110000);
    s7.authToken = sha512("authtokenS7");
    s7.wix_id = "00000000-0000-0002-0001-1b4c4c5263213155";
    s7.wix_creation_date = new Date(new Date().getTime() - 11000000);
    s7.subjects = JSON.stringify([
        { name: "Englisch", minGrade: 1, maxGrade: 8 },
        { name: "Spanisch", minGrade: 6, maxGrade: 10 },
    ]);
    s7.openMatchRequestCount = 1;
    students.push(s7);

    for (let i = 0; i < students.length; i++) {
        await entityManager.save(Student, students[i]);
        console.log("Inserted Dev Student " + i);
    }

    const matches: Match[] = [];

    let m = new Match();
    m.uuid = "000000001-0000-0000-0001-1b4c4c526364";
    m.pupil = pupils[0];
    m.student = students[0];
    matches.push(m);

    m = new Match();
    m.uuid = "000000001-0000-0000-0002-1b4c4c526364";
    m.pupil = pupils[1];
    m.student = students[0];
    matches.push(m);

    for (let i = 0; i < matches.length; i++) {
        await entityManager.save(Match, matches[i]);
        console.log("Inserted Dev Match " + i);
    }

    const projectMatches: ProjectMatch[] = [];

    let pm = new ProjectMatch(pupils[3], students[5]);
    pm.uuid = "000000001-0000-0000-0001-2c5d5d637475";
    projectMatches.push(pm);

    for (let i = 0; i < projectMatches.length; i++) {
        await entityManager.save(ProjectMatch, projectMatches[i]);
        console.log("Inserted Dev ProjectMatch " + i);
    }

    let pc = new ParticipationCertificate();
    pc.uuid = randomBytes(5).toString("hex").toUpperCase();
    pc.pupil = pupils[0];
    pc.student = students[0];
    pc.subjects = "Englisch,Deutsch";
    pc.certificateDate = new Date();
    pc.startDate = new Date();
    pc.endDate = new Date();
    pc.categories = "xyzipd";
    pc.hoursTotal = 8;
    pc.medium = "PC";
    pc.hoursPerWeek = 8;

    await entityManager.save(ParticipationCertificate, pc);
    console.log("Inserted a certificate with ID: " + pc.uuid);

    // mentor

    const mentors: Mentor[] = [];

    const mentor1 = new Mentor();
    mentor1.firstname = "Aurelie";
    mentor1.lastname = "Streich";
    mentor1.active = true;
    mentor1.email = "aurelie.streich@example.com";
    mentor1.verification = null;
    mentor1.verifiedAt = new Date(new Date().getTime() - 200000);
    mentor1.authToken = sha512("authtokenM3");
    mentor1.division = [Division.EVENTS, Division.FACEBOOK];
    mentor1.expertise = [
        Expertise.SPECIALIZED,
        Expertise.EDUCATIONAL,
        Expertise.TECHSUPPORT,
        Expertise.SELFORGANIZATION,
    ];
    mentor1.subjects = null;
    mentor1.teachingExperience = true;
    mentor1.message = "text";
    mentor1.description = "text";
    mentor1.wix_id = "00000000-0000-0001-0001-1b4c4c526364";
    mentor1.wix_creation_date = new Date(new Date().getTime() - 10000000);
    mentor1.subjects = JSON.stringify([
        { name: "Englisch", minGrade: 1, maxGrade: 8 },
        { name: "Spanisch", minGrade: 6, maxGrade: 10 },
    ]);

    mentors.push(mentor1);

    for (let i = 0; i < mentors.length; i++) {
        await entityManager.save(Mentor, mentors[i]);
        console.log("Inserted Dev Mentor " + i);
    }

    // course tags
    const tags: CourseTag[] = [];

    let t = new CourseTag();
    t.name = "easy";
    t.identifier = "easy";
    t.category = "revision";
    tags.push(t);

    t = new CourseTag();
    t.name = "medium";
    t.identifier = "medium";
    t.category = "revision";
    tags.push(t);

    t = new CourseTag();
    t.name = "difficult";
    t.identifier = "difficult";
    t.category = "revision";
    tags.push(t);

    t = new CourseTag();
    t.name = "Mathematik";
    t.identifier = "Mathematics";
    t.category = "revision";
    tags.push(t);

    t = new CourseTag();
    t.name = "Englisch";
    t.identifier = "English";
    t.category = "revision";
    tags.push(t);

    const revision = (t = new CourseTag());
    t.name = "Deutsch";
    t.identifier = "German";
    t.category = "revision";
    tags.push(t);

    const clubTagNamesMap = {
        "mint": "MINT",
        "liberalarts": "Geisteswissenschaften",
        "socialsciences": "Sozialwissenschaften",
        "language": "Sprache",
        "music-art-culture": "Musik, Kunst und Kultur",
        "environment": "Natur und Umwelt",
        "personaldevelopment": "Persönlichkeitsentwicklung",
        "play&fun": "Spiel und Spaß",
        "priorknowledge-no": "Ohne Vorkenntnisse",
        "priorknowledge-required": "Vorkenntnisse benötigt",
        "material-no": "Ohne Material",
        "material-required": "Material benötigt",
        "creativity": "Kreativität",
        "sports": "Sport & Bewegung",
        "science": "Naturwissenschaften",
        "music": "Musik",
        "health": "Gesundheit",
        "intercultural": "Interkulturelles"
    };

    const clubTagMap = Object.fromEntries(Object.entries(clubTagNamesMap).map( ([identifier, name]) => {
        const t = new CourseTag();
        t.name = name;
        t.identifier = identifier;
        t.category = "club";

        return [identifier, t];
    }));

    const mint = clubTagMap["mint"];
    const musicArtCulture = clubTagMap["music-art-culture"];
    const play = clubTagMap["play&fun"];
    const creativity = clubTagMap["creativity"];
    const sports = clubTagMap["sports"];
    const science = clubTagMap["science"];
    const music = clubTagMap["music"];
    const health = clubTagMap["health"];

    const clubTags = Object.values(clubTagMap);
    tags.push(...clubTags);

    const preparation = (t = new CourseTag());
    t.name = "Prüfungsvorbereitung";
    t.identifier = "preparation";
    t.category = "coaching";
    tags.push(t);

    t = new CourseTag();
    t.name = "Selbstsorganisation";
    t.identifier = "organisation";
    t.category = "coaching";
    tags.push(t);

    const personality = (t = new CourseTag());
    t.name = "Persönlichkeitsbildung";
    t.identifier = "personality";
    t.category = "coaching";
    tags.push(t);

    for (let i = 0; i < tags.length; i++) {
        await entityManager.save(CourseTag, tags[i]);
        console.log("Inserted Course Tag " + tags[i].identifier);
    }

    // courses

    const courses: Course[] = [];

    let course1 = new Course();
    course1.instructors = [s1, s2];
    course1.name = "Grundlagen der Physik";
    course1.outline = "E(m) = m * c * c";
    course1.description =
        "Es gibt zwei Dinge, die sind unendlich. Das Universum und die menschliche Dummheit. Obwohl, bei dem einen bin ich mir nicht so sicher.";
    course1.category = CourseCategory.COACHING;
    course1.tags = [preparation, science];
    course1.subcourses = [];
    course1.courseState = CourseState.SUBMITTED;

    courses.push(course1);

    let course2 = new Course();
    course2.instructors = [s1];
    course2.name =
        "COBOL und ABAP - Eine Reise in die Steinzeit der Informatik";
    course2.outline = "Mit lebenden Exemplaren zum anschauen";
    course2.description =
        "COBOL und ABAP prägen unser Leben wie kaum andere Programmiersprachen - Und doch kennt sie kaum jemand.";
    course2.category = CourseCategory.CLUB;
    course2.tags = [science];
    course2.subcourses = [];
    course2.courseState = CourseState.ALLOWED;

    courses.push(course2);

    let course3 = new Course();
    course3.instructors = [s1, s2];
    course3.name = "Grundlagen der Mathematik";
    course3.outline = "(0 + 1) * a = a * 0 + 1 * a => a * 0 = 0";
    course3.description =
        "Hinter=den einfachsten Aussagen steckt viel mehr Logik, als man eigentlich erwartet ...";
    course3.category = CourseCategory.REVISION;
    course3.tags = [preparation, science];
    course3.subcourses = [];
    course3.courseState = CourseState.DENIED;

    courses.push(course3);

    let course4 = new Course();
    course4.instructors = [s2];
    course4.name = "KIZ, 187, Aligatoah.";
    course4.outline = "Die Musik des neuen Jahrtausends";
    course4.description =
        "Eine=musikalische Reise zu den melodischen Klängen der neuen Musikgenres.";
    course4.category = CourseCategory.REVISION;
    course4.tags = [preparation, science];
    course4.subcourses = [];
    course4.courseState = CourseState.CANCELLED;

    courses.push(course4);

    // for testing courseAttendanceLog
    let course5 = new Course();
    course5.instructors = [s1, s2];
    course5.name = "Gitarre lernen für Anfänger";
    course5.outline = "Mit 3 Akkorden zum ersten Song";
    course5.description =
        "In diesem Kurs lernst du das Instrument und 3 einfache Akkorde kennen, mit denen du einen ganzen Song spielen kannst!";
    course5.category = CourseCategory.CLUB;
    course5.tags = [music];
    course5.subcourses = [];
    course5.courseState = CourseState.ALLOWED;

    courses.push(course5);

    let course6 = new Course();
    course6.instructors = [s1];
    course6.name = "The Science behind Chocolate";
    course6.outline =
        "Can you actually burn chocolate? Does chocolate make me happy? Where do most cocoa beans come from?";
    course6.description =
        "Chocolate comes in all shapes and sizes, varying degrees of colour and sweetness – Nearly everyone likes chocolate! But what is the science behind chocolate? What are the myths that exist around chocolate? And last, but not least: What is our impact as consumers of chocolate? Want to know more about it? Then, join us for our upcoming sessions on the world of chocolate! The sessions will take part in English – but do not hesitate to come along. No worries – your English does not need to be perfect!";
    course6.category = CourseCategory.CLUB;
    course6.tags = [science, creativity, play];
    course6.subcourses = [];
    course6.courseState = CourseState.ALLOWED;

    courses.push(course6);

    let course7 = new Course();
    course7.instructors = [s1];
    course7.name = "1x1 der Studienfinanzierung";
    course7.outline =
        "Fit ins Studium - Wie du ohne finanzielle Sorgen das Studium beginnst!";
    course7.description =
        "Studium! - aber keine Ahnung wie? Oder wie viel? Du möchtest gerne studieren, aber weißt nicht, was es kostet? Oder du weißt, was es kostet, aber nicht, wie du es bezahlen sollst? Von Stipendien hast du gehört, aber glaubst, dass die nur für Ausnahmetalente sind? In unserem Kurs möchten wir all diese Fragen und noch viel mehr diskutieren und auch mit einigen Mythen aufräumen. In diesem Kurs werden wir die folgenden Themen genauer besprechen: •	Welche Kosten kommen im Studium auf Dich zu? •	Universität vs. (Fach-)Hochschule: Was sind die Unterschiede? •	Privat- oder öffentlich finanziertes Studium? •	Ankommen im ‚Uni‘-Leben •	Finanzierung des Studiums: BAföG, Stipendien, Studienkredite und weitere Möglichkeiten";
    course7.category = CourseCategory.CLUB;
    course7.tags = [science, creativity, play];
    course7.subcourses = [];
    course7.courseState = CourseState.ALLOWED;

    courses.push(course7);

    let course8 = new Course();
    course8.instructors = [s1];
    course8.name = "Lorem Ipsum";
    course8.outline =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    course8.description =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    course8.category = CourseCategory.CLUB;
    course8.tags = [science, creativity, play];
    course8.subcourses = [];
    course8.courseState = CourseState.ALLOWED;

    courses.push(course8);

    let course9 = new Course();
    course9.instructors = [s1];
    course9.name = "dolor sit amet, consectetur";
    course9.outline =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    course9.description =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    course9.category = CourseCategory.CLUB;
    course9.tags = [science, music, play];
    course9.subcourses = [];
    course9.courseState = CourseState.ALLOWED;

    courses.push(course9);

    for (const course of courses) {
        await entityManager.save(Course, course);

        console.log("Inserted Course " + course.name);
    }

    // courses

    const subcourses = [];

    const subcourse1 = new Subcourse();
    subcourse1.course = course1;
    subcourse1.joinAfterStart = true;
    subcourse1.minGrade = 1;
    subcourse1.maxGrade = 13;
    subcourse1.instructors = [s1, s2];
    subcourse1.maxParticipants = 4;
    subcourse1.published = false;

    subcourses.push(subcourse1);

    const subcourse2 = new Subcourse();
    subcourse2.course = course2;
    subcourse2.joinAfterStart = true;
    subcourse2.minGrade = 3;
    subcourse2.maxGrade = 10;
    subcourse2.instructors = [s1];
    subcourse2.maxParticipants = 10;
    subcourse2.published = true;
    subcourse2.participants = pupils;

    subcourses.push(subcourse2);

    const subcourse3 = new Subcourse();
    subcourse3.course = course3;
    subcourse3.joinAfterStart = false;
    subcourse3.minGrade = 10;
    subcourse3.maxGrade = 11;
    subcourse3.instructors = [s1, s2];
    subcourse3.maxParticipants = 10;
    subcourse3.published = true;

    subcourses.push(subcourse3);

    const subcourse4 = new Subcourse();
    subcourse4.course = course4;
    subcourse4.joinAfterStart = false;
    subcourse4.minGrade = 8;
    subcourse4.maxGrade = 11;
    subcourse4.instructors = [s2];
    subcourse4.maxParticipants = 10;
    subcourse4.published = true;

    subcourses.push(subcourse4);

    const subcourse5 = new Subcourse();
    subcourse5.course = course5;
    subcourse5.joinAfterStart = true;
    subcourse5.minGrade = 3;
    subcourse5.maxGrade = 10;
    subcourse5.instructors = [s1, s2];
    subcourse5.maxParticipants = 10;
    subcourse5.published = true;
    subcourse5.participants = pupils;

    subcourses.push(subcourse5);

    const subcourse6 = new Subcourse();
    subcourse6.course = course5;
    subcourse6.joinAfterStart = true;
    subcourse6.minGrade = 3;
    subcourse6.maxGrade = 10;
    subcourse6.instructors = [s1, s2];
    subcourse6.maxParticipants = 10;
    subcourse6.published = true;
    subcourse6.participants = pupils;

    subcourses.push(subcourse6);

    // courseId and subcourseId should be different. Used for testing courseAttendanceLog
    const subcourse7 = new Subcourse();
    subcourse7.course = course5;
    subcourse7.joinAfterStart = true;
    subcourse7.minGrade = 3;
    subcourse7.maxGrade = 10;
    subcourse7.instructors = [s1, s2];
    subcourse7.maxParticipants = 10;
    subcourse7.published = true;
    subcourse7.participants = pupils;

    subcourses.push(subcourse7);

    const subcourse8 = new Subcourse();
    subcourse8.course = course6;
    subcourse8.joinAfterStart = true;
    subcourse8.minGrade = 3;
    subcourse8.maxGrade = 10;
    subcourse8.instructors = [s1];
    subcourse8.maxParticipants = 10;
    subcourse8.published = true;
    subcourse8.participants = pupils;

    subcourses.push(subcourse8);

    const subcourse9 = new Subcourse();
    subcourse9.course = course7;
    subcourse9.joinAfterStart = true;
    subcourse9.minGrade = 1;
    subcourse9.maxGrade = 10;
    subcourse9.instructors = [s1];
    subcourse9.maxParticipants = 20;
    subcourse9.published = true;
    subcourse9.participants = pupils;

    subcourses.push(subcourse9);

    const subcourse10 = new Subcourse();
    subcourse10.course = course8;
    subcourse10.joinAfterStart = true;
    subcourse10.minGrade = 1;
    subcourse10.maxGrade = 10;
    subcourse10.instructors = [s1];
    subcourse10.maxParticipants = 20;
    subcourse10.published = true;
    subcourse10.participants = pupils;

    subcourses.push(subcourse10);

    const subcourse11 = new Subcourse();
    subcourse11.course = course9;
    subcourse11.joinAfterStart = true;
    subcourse11.minGrade = 1;
    subcourse11.maxGrade = 10;
    subcourse11.instructors = [s1];
    subcourse11.maxParticipants = 20;
    subcourse11.published = true;
    subcourse11.participants = pupils;

    subcourses.push(subcourse11);

    for (const subcourse of subcourses) {
        await entityManager.save(Subcourse, subcourse);
        console.log("Inserted SubCourse.");
    }

    // lectures

    const lectures = [];

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const lecture1: Lecture = new Lecture();
    lecture1.subcourse = subcourse1;
    lecture1.duration = 45;
    lecture1.start = new Date(year, month, date + 5, 20, 0, 0, 0);
    lecture1.instructor = s1;

    const lecture2: Lecture = new Lecture();
    lecture2.subcourse = subcourse1;
    lecture2.duration = 45;
    lecture2.start = new Date(year, month, date + 6, 20, 0, 0, 0);
    lecture2.instructor = s1;

    const lecture3: Lecture = new Lecture();
    lecture3.subcourse = subcourse2;
    lecture3.duration = 120;
    lecture3.start = new Date(year, month, date + 10, 19, 0, 0, 0);
    lecture3.instructor = s1;

    const lecture4: Lecture = new Lecture();
    lecture4.subcourse = subcourse2;
    lecture4.duration = 120;
    lecture4.start = new Date(year, month, date + 14, 21, 0, 0, 0);
    lecture4.instructor = s1;

    // today's past lecture for courseAttendanceLog
    const lecture5: Lecture = new Lecture();
    lecture5.subcourse = subcourse2;
    lecture5.duration = 120;
    lecture5.start = new Date(year, month, date, 4, 0, 0, 0);
    lecture5.instructor = s1;

    // today's active lecture for courseAttendanceLog
    const lecture6: Lecture = new Lecture();
    lecture6.subcourse = subcourse2;
    lecture6.duration = 60;
    lecture6.start = new Date(year, month, date, hours, minutes - 1, 0, 0);
    lecture6.instructor = s1;

    // today's second active lecture for courseAttendanceLog
    const lecture7: Lecture = new Lecture();
    lecture7.subcourse = subcourse7;
    lecture7.duration = 60;
    lecture7.start = new Date(year, month, date, hours, minutes - 1, 0, 0);
    lecture7.instructor = s1;

    const lecture8: Lecture = new Lecture();
    lecture8.subcourse = subcourse3;
    lecture8.duration = 90;
    lecture8.start = new Date(year, month, date + 5, 10, 0, 0, 0);
    lecture8.instructor = s2;

    const lecture9: Lecture = new Lecture();
    lecture9.subcourse = subcourse4;
    lecture9.duration = 120;
    lecture9.start = new Date(year, month, date + 15, 11, 0, 0, 0);
    lecture9.instructor = s2;

    const lecture10: Lecture = new Lecture();
    lecture10.subcourse = subcourse8;
    lecture10.duration = 120;
    lecture10.start = new Date(year, month, date + 10, 19, 0, 0, 0);
    lecture10.instructor = s1;

    const lecture11: Lecture = new Lecture();
    lecture11.subcourse = subcourse9;
    lecture11.duration = 60;
    lecture11.start = new Date(year, month, date + 10, 19, 0, 0, 0);
    lecture11.instructor = s1;

    const lecture12: Lecture = new Lecture();
    lecture12.subcourse = subcourse10;
    lecture12.duration = 60;
    lecture12.start = new Date(year, month, date + 11, 20, 0, 0, 0);
    lecture12.instructor = s1;

    const lecture13: Lecture = new Lecture();
    lecture13.subcourse = subcourse11;
    lecture13.duration = 60;
    lecture13.start = new Date(year, month, date + 12, 20, 0, 0, 0);
    lecture13.instructor = s1;

    lectures.push(
        lecture1,
        lecture2,
        lecture3,
        lecture4,
        lecture5,
        lecture6,
        lecture7,
        lecture8,
        lecture9,
        lecture10,
        lecture11,
        lecture12,
        lecture13
    );

    for (const lecture of lectures) {
        await entityManager.save(Lecture, lecture);
        console.log("Inserted Lecture.");
    }

    // Screening results
    const screeners: Screener[] = [];

    let screener = new Screener();
    screener.firstname = "Maxi";
    screener.lastname = "Screenerfrau";
    screener.active = true;
    screener.email = "maxi-screening@example.org";
    screener.oldNumberID = -1;
    // Screeners use another hashing algorithm than regular users
    screener.password = await hashPassword("screener");
    screener.verified = true;

    screeners.push(screener);

    let screener2 = new Screener();
    screener2.firstname = "Hanna";
    screener2.lastname = "Falkland";
    screener2.active = true;
    screener2.email = "hanna@corona-school.de";
    screener2.oldNumberID = -2;
    screener2.password = await hashPassword("smsmsms"); //Don't be a fool, try Corona School ❤️
    screener2.verified = true;

    screeners.push(screener2);

    for (let i = 0; i < screeners.length; i++) {
        await entityManager.save(Screener, screeners[i]);
        console.log("Inserted Dev Screener " + i);
    }

    const screenings: Screening[] = [];

    let sres = new Screening();
    sres.success = true;
    sres.comment = "🎉";
    sres.knowsCoronaSchoolFrom = "Internet";
    sres.screener = screeners[0];
    sres.student = students[0];

    screenings.push(sres);

    let sres2 = new Screening();
    sres2.success = true;
    sres2.comment = "🎉";
    sres2.knowsCoronaSchoolFrom = "Internet";
    sres2.screener = screeners[0];
    sres2.student = students[1];

    screenings.push(sres2);

    let sres3 = new Screening();
    sres3.success = true;
    sres3.comment = "🎉";
    sres3.knowsCoronaSchoolFrom = "Internet";
    sres3.screener = screeners[0];
    sres3.student = students[2];

    screenings.push(sres3);

    for (let i = 0; i < screenings.length; i++) {
        await entityManager.save(Screening, screenings[i]);
        console.log("Inserted Dev Screening " + i);
    }

    // instructor screening
    const instructorScreenings: InstructorScreening[] = [];

    const instructorScrenning1 = new InstructorScreening();
    instructorScrenning1.success = true;
    instructorScrenning1.comment = "🎉";
    instructorScrenning1.knowsCoronaSchoolFrom = "Internet";
    instructorScrenning1.screener = screeners[0];
    instructorScrenning1.student = students[2];

    instructorScreenings.push(instructorScrenning1);

    const instructorScrenning2 = new InstructorScreening();
    instructorScrenning2.success = true;
    instructorScrenning2.comment = "🎉";
    instructorScrenning2.knowsCoronaSchoolFrom = "Internet";
    instructorScrenning2.screener = screeners[0];
    instructorScrenning2.student = students[1];

    instructorScreenings.push(instructorScrenning2);

    const instructorScrenning3 = new InstructorScreening();
    instructorScrenning3.success = true;
    instructorScrenning3.comment = "🎉";
    instructorScrenning3.knowsCoronaSchoolFrom = "Internet";
    instructorScrenning3.screener = screeners[0];
    instructorScrenning3.student = students[0];

    instructorScreenings.push(instructorScrenning3);

    for (let i = 0; i < instructorScreenings.length; i++) {
        await entityManager.save(InstructorScreening, instructorScreenings[i]);
        console.log("Inserted Dev Instrcutor Screening " + i);
    }

    //project coaching screenings
    const projectCoachingScreenings: ProjectCoachingScreening[] = [];

    const projectCoachingScreening1 = new ProjectCoachingScreening();
    projectCoachingScreening1.success = true;
    projectCoachingScreening1.comment = "🎉";
    projectCoachingScreening1.knowsCoronaSchoolFrom = "Internet";
    projectCoachingScreening1.screener = screeners[0];
    projectCoachingScreening1.student = students[5];

    projectCoachingScreenings.push(projectCoachingScreening1);

    for (let i = 0; i < projectCoachingScreenings.length; i++) {
        await entityManager.save(
            ProjectCoachingScreening,
            projectCoachingScreenings[i]
        );
        console.log("Inserted Dev Project Screening " + i);
    }

    // Test data for course attendance log

    for (let i = 0; i < pupils.length; i++) {
        // pupil attended lecture in the past
        const courseAttendanceLog1 = new CourseAttendanceLog();
        courseAttendanceLog1.createdAt = new Date("2020-08-10 08:00:00.983055");
        courseAttendanceLog1.ip = "localhost";
        courseAttendanceLog1.pupil = pupils[i];
        courseAttendanceLog1.lecture = lecture3;
        await entityManager.save(CourseAttendanceLog, courseAttendanceLog1);
        console.log("Inserted Dev CourseAttendanceLog " + i);

        // pupil attended today's lecture, which is already over
        const courseAttendanceLog2 = new CourseAttendanceLog();
        courseAttendanceLog2.ip = "localhost";
        courseAttendanceLog2.pupil = pupils[i];
        courseAttendanceLog2.lecture = lecture5;
        await entityManager.save(CourseAttendanceLog, courseAttendanceLog2);
        console.log("Inserted Dev CourseAttendanceLog " + i);
    }

    //Insert some schools
    const schools: School[] = [];

    const school1 = new School();
    school1.name = "Corona School Germany";
    school1.emailDomain = "corona-school.de";
    school1.website = "https://corona-school.de";
    school1.state = State.OTHER;
    school1.schooltype = SchoolType.SONSTIGES;
    school1.activeCooperation = true;

    schools.push(school1);

    for (let i = 0; i < schools.length; i++) {
        await entityManager.save(schools[i]);
        console.log("Inserted Dev School " + i);
    }

    //Insert expert data
    const expertiseTags: ExpertiseTag[] = [];

    const tag1 = new ExpertiseTag();
    tag1.name = "LTE";

    expertiseTags.push(tag1);

    const tag2 = new ExpertiseTag();
    tag2.name = "Glasfaser";

    expertiseTags.push(tag2);

    for (let i = 0; i < expertiseTags.length; i++) {
        await entityManager.save(expertiseTags[i]);
        console.log("Inserted Expertise Tag " + i);
    }

    const experts: ExpertData[] = [];

    const expert1 = new ExpertData();
    expert1.student = students[5];
    expert1.contactEmail = "contact@jufo-tufo.de";
    expert1.description = "JuFo is great!";

    experts.push(expert1);

    const expert2 = new ExpertData();
    expert2.student = students[6];
    expert2.contactEmail = "contact@jufo-tufo.de";
    expert2.description =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida, erat in dignissim vestibulum, ex nisl consequat nisl, at sagittis mauris Glasfaser eu nisl. Cras quis dui blandit, tincidunt libero id, porttitor nisi. Sed eu tellus interdum, luctus quam id, pretium dolor. Praesent feugiat quis sem in porttitor. Ut auctor erat nisl, vitae tempus nisl ullamcorper nec.";
    expert2.active = true;
    expert2.allowed = ExpertAllowedIndication.YES;
    expert2.expertiseTags = [tag1, tag2];

    experts.push(expert2);

    const expert3 = new ExpertData();
    expert3.student = students[3];
    expert3.contactEmail = "contact2@jufo-tufo.de";
    expert3.description =
        "Die Elektronik ist ein Hauptgebiet der Elektrotechnik. Sie ist die Wissenschaft von der Steuerung des elektrischen Stromes durch elektronische Schaltungen, das heißt Schaltungen, in denen mindestens ein Bauelement aufgrund von Vakuum- oder Halbleiter-Leitung funktioniert. Elektronische Elemente verhalten sich nichtlinear, während das Verhalten anderer elektrischer (nicht-elektronischer) Elemente als linear bezeichnet wird";
    expert3.active = true;
    expert3.allowed = ExpertAllowedIndication.YES;
    expert3.expertiseTags = [tag2];

    experts.push(expert3);

    const expert4 = new ExpertData();
    expert4.student = students[4];
    expert4.contactEmail = "contact3@jufo-tufo.de";
    expert4.description =
        "Chemie ([çeˈmi:]; mittel- und norddeutsch auch [ʃeˈmi:]; süddeutsch: [keˈmi:]) ist diejenige Naturwissenschaft, die sich mit dem Aufbau, den Eigenschaften und der Umwandlung von chemischen Stoffen beschäftigt. Ein Stoff besteht aus Atomen, Molekülen oder beidem. Er kann außerdem Ionen enthalten. Die chemischen Reaktionen sind Vorgänge in den Elektronenhüllen der Atome, Moleküle und Ionen.";
    expert4.active = true;
    expert4.allowed = ExpertAllowedIndication.YES;
    expert4.expertiseTags = [tag1];

    experts.push(expert4);

    for (let i = 0; i < experts.length; i++) {
        await entityManager.save(experts[i]);
        console.log("Inserted Dev Expert " + i);
    }
}

function sha512(input: string): string {
    const hash = createHash("sha512");
    return hash.update(input).digest("hex");
}
