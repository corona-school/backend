import {
    Column,
    Entity,
    EntityManager,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne
} from "typeorm";
import { ApiScreeningResult } from "../dto/ApiScreeningResult";
import { Match } from "./Match";
import { Screening } from "./Screening";
import { Person } from "./Person";
import { Course } from "./Course";
import { Lecture } from './Lecture';
import { CourseTag } from './CourseTag';

export enum TeacherModule {
    INTERNSHIP = "internship",
    SEMINAR = "seminar"
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
    @Column("date", {
        nullable: true
    })
    birthday: Date;

    @Column({
        nullable: true
    })
    msg: string;

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
        default: true
    })
    isStudent: boolean;

    @Column({
        nullable: true
    })
    subjects: string;

    @OneToMany((type) => Match, (match) => match.student, {
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

    @ManyToMany(type => CourseTag, tag => tag.students)
    @JoinTable()
    courseTags: Promise<CourseTag[]>

    @Column({
        nullable: true,
        default: null
    })
    instructorDescription: string;

    @ManyToMany(type => Course, course => course.instructors)
    courses: Promise<Course[]>;

    @ManyToOne(type => Lecture, lecture => lecture.instructor)
    @JoinColumn()
    lectures: Promise<Lecture[]>;

    /*
     * Teacher data
     */
    @Column({
        default: false
    })
    isTeacher: boolean;

    @Column({
        nullable: true
    })
    state: string;

    @Column({
        nullable: true
    })
    university: string;

    @Column({
        type: "enum",
        enum: TeacherModule,
        nullable: true,
        default: null
    })
    module: TeacherModule;

    @Column({
        nullable: true
    })
    moduleHours: number;

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


    async addScreeningResult(screeningResult: ApiScreeningResult) {
        this.phone =
            screeningResult.phone === undefined
                ? this.phone
                : screeningResult.phone;
        this.birthday =
            screeningResult.birthday === undefined
                ? this.birthday
                : screeningResult.birthday;
        this.subjects =
            screeningResult.subjects === undefined
                ? this.subjects
                : screeningResult.subjects;
        this.feedback =
            screeningResult.feedback === undefined
                ? this.feedback
                : screeningResult.feedback;

        let currentScreening = await this.screening;

        if (!currentScreening) {
            currentScreening = new Screening();
        }
        await currentScreening.addScreeningResult(screeningResult);
        this.screening = Promise.resolve(currentScreening);
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

    //Returns the URL that the student can use to get to his screening video call
    screeningURL(): string {
        //for now, this is just static and does not dynamically depend on the student's email address (but this is planned for future, probably)
        return "https://authentication.corona-school.de/";
    }
}

export enum ScreeningStatus {
    Unscreened = "UNSCREENED",
    Accepted = "ACCEPTED",
    Rejected = "REJECTED",
}

export function getAllStudents(
    manager: EntityManager
): Promise<Student[]> | undefined {
    return manager.createQueryBuilder(Student, "s").getMany(); //case insensitive query
}

export function getStudentByEmail(
    manager: EntityManager,
    email: string
): Promise<Student> | undefined {
    return manager
        .createQueryBuilder(Student, "s")
        .where("s.email ILIKE :email", { email: email })
        .orderBy("s.email")
        .getOne(); //case insensitive query
}

export function getStudentByWixID(manager: EntityManager, wixID: string) {
    return manager.findOne(Student, { wix_id: wixID });
}

export async function activeMatchesOfStudent(
    s: Student,
    manager: EntityManager
) {
    return (await s.matches).filter((m) => m.dissolved === false);
}

export async function activeMatchCountOfStudent(
    s: Student,
    manager: EntityManager
) {
    return (await activeMatchesOfStudent(s, manager)).length;
}
