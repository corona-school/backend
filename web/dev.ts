import { getConnection, getManager } from "typeorm";
import { createHash } from "crypto";
import { Pupil } from "../common/entity/Pupil";
import { Student } from "../common/entity/Student";
import { Match } from "../common/entity/Match";
import { Screener } from "../common/entity/Screener";
import { Screening } from "../common/entity/Screening";
import { hashPassword } from "../common/util/hashing";
import { CourseTag } from "../common/entity/CourseTag";
import { Course, CourseState } from "../common/entity/Course";
import { CourseCategory } from "../common/entity/Course";

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

    t = new CourseTag();
    t.name = "Deutsch";
    t.identifier = "German";
    t.category = "revision";
    tags.push(t);

    t = new CourseTag();
    t.name = "Spiel&Spaß";
    t.identifier = "play&fun";
    t.category = "club";
    tags.push(t);

    t = new CourseTag();
    t.name = "Kreativität";
    t.identifier = "creativity";
    t.category = "club";
    tags.push(t);

    t = new CourseTag();
    t.name = "Sport & Bewegung";
    t.identifier = "sports";
    t.category = "club";
    tags.push(t);

    const science = t = new CourseTag();
    t.name = "Naturwissenschaften";
    t.identifier = "science";
    t.category = "club";
    tags.push(t);

    t = new CourseTag();
    t.name = "Musik";
    t.identifier = "music";
    t.category = "club";
    tags.push(t);

    t = new CourseTag();
    t.name = "Gesundheit";
    t.identifier = "health";
    t.category = "club";
    tags.push(t);

    t = new CourseTag();
    t.name = "Interkulturelles";
    t.identifier = "intercultural";
    t.category = "club";
    tags.push(t);

    const preparation = t = new CourseTag();
    t.name = "Prüfungsvorbereitung";
    t.identifier = "preparation";
    t.category = "coaching";
    tags.push(t);

    t = new CourseTag();
    t.name = "Selbstsorganisation";
    t.identifier = "organisation";
    t.category = "coaching";
    tags.push(t);

    const personality = t = new CourseTag();
    t.name = "Persönlichkeitsbildung";
    t.identifier = "personality";
    t.category = "coaching";
    tags.push(t);

    for (let i = 0; i < tags.length; i++) {
        await entityManager.save(CourseTag, tags[i]);
        console.log("Inserted Course Tag " + tags[i].identifier);
    }

    // courses

    const courses = [
        Object.assign(new Course(), {
            instructors: [s1, s2],
            name: "Grundlagen der Physik",
            outline: "E(m) = m * c * c",
            description: "Es gibt zwei Dinge, die sind unendlich. Das Universum und die menschliche Dummheit. Obwohl, bei dem einen bin ich mir nicht so sicher.",
            imageUrl: null,
            category: CourseCategory.COACHING,
            tags: [preparation, science],
            subcourses: [],
            courseState: CourseState.SUBMITTED, 
        }),
        Object.assign(new Course(), {
            instructors: [s1],
            name: "COBOL und ABAP - Eine Reise in die Steinzeit der Informatik",
            outline: "Mit lebenden Exemplaren zum anschauen",
            description: "COBOL und ABAP prägen unser Leben wie kaum andere Programmiersprachen - Und doch kennt sie kaum jemand.",
            imageUrl: null,
            category: CourseCategory.CLUB,
            tags: [science],
            subcourses: [],
            courseState: CourseState.ALLOWED, 
        }),
        Object.assign(new Course(), {
            instructors: [s1, s2],
            name: "Grundlagen der Mathematik",
            outline: "(0 + 1) * a = a * 0 + 1 * a => a * 0 = 0",
            description: "Hinter den einfachsten Aussagen steckt viel mehr Logik, als man eigentlich erwartet ...",
            imageUrl: null,
            category: CourseCategory.REVISION,
            tags: [preparation, science],
            subcourses: [],
            courseState: CourseState.DENIED, 
        }),
        Object.assign(new Course(), {
            instructors: [s2],
            name: "KIZ, 187, Aligatoah.",
            outline: "Die Musik des neuen Jahrtausends",
            description: "Eine musikalische Reise zu den melodischen Klängen der neuen Musikgenres.",
            imageUrl: null,
            category: CourseCategory.REVISION,
            tags: [preparation, science],
            subcourses: [],
            courseState: CourseState.CANCELLED, 
        }),
        Object.assign(new Course(), {
            instructors: [],
            name: "Die Geschichte der Dampflok",
            outline: "Von Adler bis Baureihe 05 - Eine bewegende Geschichte",
            description: "Wusstest du, das die schnellste Dampflok bis zu 200km/h fuhr? Nein? Dann bist du hier genau richtig!",
            imageUrl: null,
            category: CourseCategory.REVISION,
            tags: [preparation, science],
            subcourses: [],
            courseState: CourseState.CREATED, 
        }),
    ];

    for (const course of courses) {
        await entityManager.save(Course, course);
        console.log("Inserted Course " + course.name);
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
