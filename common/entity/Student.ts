import { Column, Entity, EntityManager, getManager, Index, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { ApiScreeningResult } from "../dto/ApiScreeningResult";
import { Match } from "./Match";
import { Screening } from "./Screening";
import { Person } from "./Person";
import { Course } from "./Course";
import { Lecture } from './Lecture';
import { State } from './State';
import { Subcourse } from "./Subcourse";
import { InstructorScreening } from "./InstructorScreening";
import { ProjectField } from "../jufo/projectFields";
import { TutorJufoParticipationIndication } from "../jufo/participationIndication";
import { ProjectFieldWithGradeRestriction } from "./ProjectFieldWithGradeRestriction";
import { ProjectCoachingScreening } from "./ProjectCoachingScreening";
import { ApiProjectCoachingScreeningResult } from "../dto/ApiProjectCoachingScreeningResult";

export enum TeacherModule {
    INTERNSHIP = "internship",
    SEMINAR = "seminar",
    OTHER = "other"
}

@Entity()
export class Student extends Person {
    /*
     * Management data
     */
    @Column()
    @Index({
        unique: true
    })
    wix_id: string;

    @Column()
    wix_creation_date: Date;

    /*
     * General data
     */
    @Column({
        nullable: true
    })
    phone: string;

    @Column({
        nullable: true
    })
    feedback: string;

    @Column({
        default: false
    })
    newsletter: boolean;

    /*
     *  Student data
     */
    @Column({
        default: false
    })
    isStudent: boolean;

    @Column({
        nullable: true
    })
    subjects: string;

    @OneToMany(type => Match, match => match.student, {
        nullable: true
    })
    matches: Promise<Match[]>;

    @Column({
        nullable: false,
        default: 1
    })
    openMatchRequestCount: number;

    /*
     * Instructor data
     */
    @Column({
        default: false
    })
    isInstructor: boolean;

    @ManyToMany(type => Course, course => course.instructors)
    courses: Course[];

    @ManyToMany(type => Subcourse, subcourse => subcourse.instructors)
    subcourses: Subcourse[];

    @OneToMany(type => Lecture, lecture => lecture.instructor)
    lectures: Lecture[];

    @Column({
        nullable: true
    })
    msg: string;

    /*
     * Intern data
     */
    @Column({
        type: 'enum',
        enum: State,
        nullable: true,
        default: State.OTHER
    })
    state: State;

    @Column({
        nullable: true
    })
    university: string;

    @Column({
        type: "enum",
        enum: TeacherModule,
        nullable: true,
        default: undefined // See typeorm/typeorm#5371: Setting this to null causes typeORM to generate 'null' as a string.
        // This is fine for now because enums in postgres are DEFAULT NULL anyways
    })
    module: TeacherModule;

    @Column({
        nullable: true
    })
    moduleHours: number;

    /*
     * Project Coaching data
     */
    @Column({
        default: false,
        nullable: false
    })
    isProjectCoach: boolean;

    @OneToMany(type => ProjectFieldWithGradeRestriction, field => field.student, {
        cascade: true
    })
    projectFields: Promise<ProjectFieldWithGradeRestriction[]>;

    @Column({
        default: TutorJufoParticipationIndication.IDK,
        nullable: false
    })
    wasJufoParticipant: TutorJufoParticipationIndication;

    @Column({
        default: true,
        nullable: false
    })
    isUniversityStudent: boolean;

    @Column({
        nullable: false,
        default: 1
    })
    openProjectMatchRequestCount: number;

    @OneToOne((type) => ProjectCoachingScreening, (projectCoachingScreening) => projectCoachingScreening.student, {
        nullable: true,
        cascade: true
    })
    projectCoachingScreening: Promise<ProjectCoachingScreening>;

    /*
     * Other data
     */
    @OneToOne((type) => Screening, (screening) => screening.student, {
        nullable: true,
        cascade: true
    })
    screening: Promise<Screening>;

    @Column({
        nullable: false,
        default: 0
    })
    sentScreeningReminderCount: number;

    @Column({
        nullable: true,
        default: null
    })
    lastSentScreeningInvitationDate: Date;

    @OneToOne((type) => InstructorScreening, (instructorScreening) => instructorScreening.student, {
        nullable: true,
        cascade: true
    })
    instructorScreening: Promise<InstructorScreening>;

    @Column({
        nullable: false,
        default: 0
    })
    sentInstructorScreeningReminderCount: number;

    @Column({
        nullable: true,
        default: null
    })
    lastSentInstructorScreeningInvitationDate: Date;

    //Pupils have the same column
    @Column({
        nullable: true,
        default: null
    })
    lastUpdatedSettingsViaBlocker: Date;

    async addScreeningResult(screeningResult: ApiScreeningResult) {
        this.phone = screeningResult.phone === undefined ? this.phone : screeningResult.phone;
        this.subjects = screeningResult.subjects === undefined ? this.subjects : screeningResult.subjects;
        this.feedback = screeningResult.feedback === undefined ? this.feedback : screeningResult.feedback;

        let currentScreening = await this.screening;

        if (!currentScreening) {
            currentScreening = new Screening();
        }
        await currentScreening.addScreeningResult(screeningResult);
        this.screening = Promise.resolve(currentScreening);
    }

    async addInstructorScreeningResult(screeningResult: ApiScreeningResult) {
        this.phone = screeningResult.phone === undefined ? this.phone : screeningResult.phone;
        this.subjects = screeningResult.subjects === undefined ? this.subjects : screeningResult.subjects;
        this.feedback = screeningResult.feedback === undefined ? this.feedback : screeningResult.feedback;

        let currentScreening = await this.instructorScreening;

        if (!currentScreening) {
            currentScreening = new InstructorScreening();
        }
        await currentScreening.addScreeningResult(screeningResult);
        this.instructorScreening = Promise.resolve(currentScreening);
    }

    async addProjectCoachingScreeningResult(screeningResult: ApiProjectCoachingScreeningResult) {
        this.feedback = screeningResult.feedback === undefined ? this.feedback : screeningResult.feedback;
        //update project fields metadata/restrictions
        await this.setProjectFields(screeningResult.projectFields);

        let currentScreening = await this.projectCoachingScreening;

        if (!currentScreening) {
            currentScreening = new ProjectCoachingScreening();
        }
        await currentScreening.addScreeningResult(screeningResult);
        this.projectCoachingScreening = Promise.resolve(currentScreening);
    }
    // Use this method if you wanna set project fields of a student, because this method is able to set them safely without errors
    // also see https://github.com/typeorm/typeorm/issues/3801
    async setProjectFields(fields: {name: ProjectField, min?: number, max?: number}[]) {
        //delete old project fields to prevent errors
        for (const pf of await this.projectFields ?? []) {
            await getManager().remove(pf);
        }
        //set new values
        this.projectFields = Promise.resolve(fields.map( f => new ProjectFieldWithGradeRestriction(f.name, f.min, f.max)));
    }

    async screeningStatus(): Promise<ScreeningStatus> {
        const screening = await this.screening;

        if (!screening) {
            return ScreeningStatus.Unscreened;
        }

        if (screening.success) {
            return ScreeningStatus.Accepted;
        } else {
            return ScreeningStatus.Rejected;
        }
    }

    async instructorScreeningStatus(): Promise<ScreeningStatus> {
        const instructorScreening = await this.instructorScreening;

        if (!instructorScreening) {
            return ScreeningStatus.Unscreened;
        }

        if (instructorScreening.success) {
            return ScreeningStatus.Accepted;
        } else {
            return ScreeningStatus.Rejected;
        }
    }

    //Returns the URL that the student can use to get to his screening video call
    screeningURL(): string {
        //for now, this is just static and does not dynamically depend on the student's email address (but this is planned for future, probably)
        return "https://authentication.corona-school.de/";
    }

    instructorScreeningURL(): string {
        return "https://go.oncehub.com/CourseReview?name=" + encodeURIComponent(this.firstname) + "&email=" + encodeURIComponent(this.email) + "&skip=1";
    }
}

export enum ScreeningStatus {
    Unscreened = "UNSCREENED",
    Accepted = "ACCEPTED",
    Rejected = "REJECTED",
}

export function getAllStudents(manager: EntityManager): Promise<Student[]> | undefined {
    return manager.createQueryBuilder(Student, "s").getMany(); //case insensitive query
}

export function getStudentByEmail(manager: EntityManager, email: string): Promise<Student> | undefined {
    return manager
        .createQueryBuilder(Student, "s")
        .where("s.email ILIKE :email", { email: email })
        .orderBy("s.email")
        .getOne(); //case insensitive query
}

export function getStudentByWixID(manager: EntityManager, wixID: string) {
    return manager.findOne(Student, { wix_id: wixID });
}

export async function activeMatchesOfStudent(s: Student, manager: EntityManager) {
    return (await s.matches).filter((m) => m.dissolved === false);
}

export async function activeMatchCountOfStudent(s: Student, manager: EntityManager) {
    return (await activeMatchesOfStudent(s, manager)).length;
}
