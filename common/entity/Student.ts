import {
    Column,
    Entity,
    EntityManager,
    Index,
    OneToMany,
    OneToOne,
} from "typeorm";
import { ApiScreeningResult } from "../dto/ApiScreeningResult";
import { Match } from "./Match";
import { Screening } from "./Screening";
import { Person } from "./Person";
import { Course } from "./Course";

@Entity()
export class Student extends Person {
    @Column()
    @Index({
        unique: true,
    })
    wix_id: string;

    @Column()
    wix_creation_date: Date;

    @Column("date", {
        nullable: true,
    })
    birthday: Date;

    @Column()
    subjects: string;

    @Column({
        nullable: true,
    })
    msg: string;

    @Column({
        nullable: true,
    })
    phone: string;

    @OneToMany((type) => Match, (match) => match.student, {
        nullable: true,
    })
    matches: Promise<Match[]>;

    @OneToOne((type) => Screening, (screening) => screening.student, {
        nullable: true,
        cascade: true,
    })
    screening: Promise<Screening>;

    @Column({
        nullable: false,
        default: 1,
    })
    openMatchRequestCount: number;

    @Column({
        nullable: true,
    })
    feedback: string;

    @Column({
        default: true
    })
    isStudent: boolean;

    @Column({
        default: false
    })
    isInstructor: boolean;

    @Column({
        nullable: true,
        default: null
    })
    instructorDescription: string;

    @OneToMany(type => Course, course => course.instructor)
    courses: Course[];

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
