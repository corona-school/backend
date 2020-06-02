import { getConnection, getManager } from "typeorm";
import { createHash } from "crypto";
import { Pupil } from "../common/entity/Pupil";
import { Student } from "../common/entity/Student";
import { Match } from "../common/entity/Match";
import { Screener } from "../common/entity/Screener";
import { Screening } from "../common/entity/Screening";
import { Course, CourseState } from "../common/entity/Course";

export async function setupDevDB() {
    const conn = getConnection();
    await conn.synchronize(true);

    const entityManager = getManager();

    const pupils: Pupil[] = [];

    let p = new Pupil();
    p.firstname = "Max";
    p.lastname = "Musterschüler";
    p.active = true;
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

    for (let i = 0; i < pupils.length; i++) {
        await entityManager.save(Pupil, pupils[i]);
        console.log("Inserted Dev Pupil " + i);
    }
    const students: Student[] = [];

    let s = new Student();
    s.firstname = "Leon";
    s.lastname = "Jackson";
    s.active = true;
    s.email = "leon-jackson@t-online.de";
    s.verification = null;
    s.verifiedAt = new Date(new Date().getTime() - 110000);
    s.authToken = sha512("authtokenS1");
    s.wix_id = "00000000-0000-0002-0001-1b4c4c526364";
    s.wix_creation_date = new Date(new Date().getTime() - 11000000);
    s.subjects = JSON.stringify([
        { name: "Englisch", minGrade: 1, maxGrade: 8 },
        { name: "Spanisch", minGrade: 6, maxGrade: 10 },
    ]);
    s.openMatchRequestCount = 1;
    students.push(s);

    s = new Student();
    s.firstname = "Melanie";
    s.lastname = "Meiers";
    s.active = true;
    s.email = "mel-98@gmail.com";
    s.verification = null;
    s.verifiedAt = new Date(new Date().getTime() - 220000);
    s.authToken = sha512("authtokenS2");
    s.wix_id = "00000000-0000-0002-0002-1b4c4c526364";
    s.wix_creation_date = new Date(new Date().getTime() - 22000000);
    s.subjects = JSON.stringify(["Deutsch3:5", "Mathematik4:6"]);
    s.openMatchRequestCount = 2;
    students.push(s);

    for (let i = 0; i < students.length; i++) {
        await entityManager.save(Student, students[i]);
        console.log("Inserted Dev Student " + i);
    }

    // courses
    const courses: Course[] = [];

    let c = new Course();
    c.instructor = students[1];
    c.name = "Basteln mit Gero";
    c.description =
        "Dieser Kurs ist einer der besten. Hier kannst du ganz viele Dinge tun. Wie basten, spaß haben und bli bla blub.";
    c.outline =
        "In diesem Kurs lernt ihr wie ihr coole Seesterne aus Pappe herstellt.";
    c.motivation =
        "Ich will den Schülern einfach beibringen wie man richtig bastelt.";
    c.requirements = "Schere, Papper und Papier";
    c.imageUrl = null;
    c.minGrade = 5;
    c.maxGrade = 12;
    c.maxParticipants = 5;
    c.categoryId = 1;
    c.joinAfterStart = false;
    c.startDate = new Date();
    c.duration = 60;
    c.frequency = 1;
    c.courseState = CourseState.CREATED;

    courses.push(c);

    c = new Course();
    c.instructor = students[1];
    c.name = "Mathe Nachhilfe";
    c.description =
        "Dieser Kurs ist einer der besten. Hier gibt es kostenlose Nachhilfe von den besten der besten.";
    c.outline = "In diesem Kurs lernt die Grundlagen der linearen Algebra";
    c.motivation = "Ich will den Schülern bei Mathe helfen.";
    c.requirements = "Taschenrechner und was zum schreiben.";
    c.imageUrl = null;
    c.minGrade = 10;
    c.maxGrade = 12;
    c.maxParticipants = 3;
    c.categoryId = 2;
    c.joinAfterStart = false;
    c.startDate = new Date();
    c.duration = 90;
    c.frequency = 3;
    c.courseState = CourseState.SUBMITTED;

    courses.push(c);

    c = new Course();
    c.instructor = students[0];
    c.name = "Wie funktionieren Robotor?";
    c.description =
        "Dieser Kurs ist einer der besten. Hier gibt es kostenlose Nachhilfe von den besten der besten.";
    c.outline = "In diesem Kurs lernt die Grundlagen der linearen Algebra";
    c.motivation = "Ich will die Schüler für Technik begeistern.";
    c.requirements = "-";
    c.imageUrl = null;
    c.minGrade = 8;
    c.maxGrade = 12;
    c.maxParticipants = 6;
    c.categoryId = 3;
    c.joinAfterStart = false;
    c.startDate = new Date();
    c.duration = 30;
    c.frequency = 3;
    c.courseState = CourseState.ALLOWED;

    c = new Course();
    c.instructor = s;
    c.name = "Abi Vorbereitung";
    c.description =
        "Dieser Kurs ist einer der besten. Hier gibt es kostenlose Nachhilfe von den besten der besten.";
    c.outline = "In diesem Kurs lernt die Grundlagen für Abitur";
    c.motivation = "Ich will die Schüler fürs lernen begeistern";
    c.requirements = "-";
    c.imageUrl = null;
    c.minGrade = 12;
    c.maxGrade = 12;
    c.maxParticipants = 10;
    c.categoryId = 3;
    c.joinAfterStart = false;
    c.startDate = new Date();
    c.duration = 45;
    c.frequency = 5;
    c.courseState = CourseState.ALLOWED;

    courses.push(c);

    for (let i = 0; i < courses.length; i++) {
        await entityManager.save(Course, courses[i]);
        console.log("Inserted Dev Course " + i);
    }

    // matches
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

    // Screening results
    const screeners: Screener[] = [];

    let screener = new Screener();
    screener.firstname = "Maxi";
    screener.lastname = "Screenerfrau";
    screener.active = true;
    screener.email = "maxi-screening@example.org";
    screener.oldNumberID = -1;
    screener.password = "🔑";
    screener.verified = true;

    screeners.push(screener);

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

    for (let i = 0; i < screenings.length; i++) {
        await entityManager.save(Screening, screenings[i]);
        console.log("Inserted Dev Screening " + i);
    }
}

function sha512(input: string): string {
    const hash = createHash("sha512");
    return hash.update(input).digest("hex");
}
