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
import { Subcourse } from "../common/entity/Subcourse";
import { Lecture } from "../common/entity/Lecture";
import { InstructorScreening } from "../common/entity/InstructorScreening";

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
        { name: "Spanisch", minGrade: 6, maxGrade: 10 }
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
        { name: "Spanisch", minGrade: 6, maxGrade: 10 }
    ]);
    s3.openMatchRequestCount = 1;
    students.push(s3);

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

    const science = (t = new CourseTag());
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
    course1.imageUrl = null;
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
    course2.imageUrl = null;
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
    course3.imageUrl = null;
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
    course4.imageUrl = null;
    course4.category = CourseCategory.REVISION;
    course4.tags = [preparation, science];
    course4.subcourses = [];
    course4.courseState = CourseState.CANCELLED;

    courses.push(course4);

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

    subcourses.push(subcourse2);

    const subcourse3 = new Subcourse();
    subcourse3.course = course3;
    subcourse3.joinAfterStart = false;
    subcourse3.minGrade = 10;
    subcourse3.maxGrade = 11;
    subcourse3.instructors = [s1, s2];
    subcourse3.maxParticipants = 10;
    subcourse3.published = true;

    subcourses.push(subcourse2);

    const subcourse4 = new Subcourse();
    subcourse4.course = course3;
    subcourse4.joinAfterStart = false;
    subcourse4.minGrade = 8;
    subcourse4.maxGrade = 11;
    subcourse4.instructors = [s2];
    subcourse4.maxParticipants = 10;
    subcourse4.published = true;

    subcourses.push(subcourse4);

    for (const subcourse of subcourses) {
        await entityManager.save(Subcourse, subcourse);
        console.log("Inserted SubCourse.");
    }

    // lectures

    const lectures = [];

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDay();

    const lecture1: Lecture = new Lecture();
    lecture1.subcourse = subcourse1;
    lecture1.duration = 45;
    lecture1.start = new Date(year, month, day + 5, 20, 0, 0, 0);
    lecture1.instructor = s1;

    const lecture2: Lecture = new Lecture();
    lecture2.subcourse = subcourse1;
    lecture2.duration = 45;
    lecture2.start = new Date(year, month, day + 6, 20, 0, 0, 0);
    lecture2.instructor = s1;

    lectures.push(lecture1, lecture2);

    const lecture3: Lecture = new Lecture();
    lecture3.subcourse = subcourse2;
    lecture3.duration = 120;
    lecture3.start = new Date(year, month, day + 10, 19, 0, 0, 0);
    lecture3.instructor = s1;

    const lecture4: Lecture = new Lecture();
    lecture4.subcourse = subcourse2;
    lecture4.duration = 120;
    lecture4.start = new Date(year, month, day + 14, 21, 0, 0, 0);
    lecture4.instructor = s1;

    lectures.push(lecture3, lecture4);

    const lecture5: Lecture = new Lecture();
    lecture5.subcourse = subcourse3;
    lecture5.duration = 90;
    lecture5.start = new Date(year, month, day + 5, 10, 0, 0, 0);
    lecture5.instructor = s2;

    lectures.push(lecture5);

    const lecture6: Lecture = new Lecture();
    lecture6.subcourse = subcourse4;
    lecture6.duration = 120;
    lecture6.start = new Date(year, month, day + 15, 11, 0, 0, 0);
    lecture6.instructor = s2;

    lectures.push(lecture6);

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
}

function sha512(input: string): string {
    const hash = createHash("sha512");
    return hash.update(input).digest("hex");
}
