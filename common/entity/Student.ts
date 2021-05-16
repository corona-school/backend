import {
    Column,
    Entity,
    EntityManager,
    getManager,
    Index,
    ManyToMany,
    OneToMany,
    OneToOne
} from "typeorm";
import { Match } from "./Match";
import { Screening } from "./Screening";
import { Person, RegistrationSource } from "./Person";
import { Course } from "./Course";
import { Lecture } from './Lecture';
import { State } from './State';
import { Subcourse } from "./Subcourse";
import { InstructorScreening } from "./InstructorScreening";
import { ProjectFieldWithGradeInfoType } from "../jufo/projectFieldWithGradeInfoType";
import { TutorJufoParticipationIndication } from "../jufo/participationIndication";
import { ProjectFieldWithGradeRestriction } from "./ProjectFieldWithGradeRestriction";
import { ProjectCoachingScreening } from "./ProjectCoachingScreening";
import { parseSubjectString, Subject, toStudentSubjectDatabaseFormat } from "../util/subjectsutils";
import { ScreeningInfo } from "../util/screening";
import { Screener } from "./Screener";
import { JufoVerificationTransmission } from "./JufoVerificationTransmission";
import { ProjectMatch } from "./ProjectMatch";
import {ExpertData} from "./ExpertData";
import { CourseGuest } from "./CourseGuest";
import { Language } from "../daz/language";

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
        default: null,
        nullable: true
    })
    wasJufoParticipant: TutorJufoParticipationIndication;

    @Column({
        default: null,
        nullable: true
    })
    hasJufoCertificate: boolean;

    @Column({
        default: null,
        nullable: true
    })
    jufoPastParticipationInfo: string;

    @Column({
        default: null,
        nullable: true
    })
    jufoPastParticipationConfirmed: boolean;

    @Column({
        default: null,
        nullable: true
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

    @Column({
        nullable: false,
        default: 0
    })
    sentJufoAlumniScreeningReminderCount: number; //a counter for counting the screening reminders sent to Jufo alumni (which are not offically registered university students)

    @Column({
        nullable: true,
        default: null
    })
    lastSentJufoAlumniScreeningInvitationDate: Date;

    @OneToOne((type) => JufoVerificationTransmission, (jufoVerificationTransmission) => jufoVerificationTransmission.student, {
        nullable: true,
        cascade: true
    })
    jufoVerificationTransmission: JufoVerificationTransmission;

    @OneToMany(type => ProjectMatch, match => match.student, { nullable: true })
    projectMatches: Promise<ProjectMatch[]>;

    @OneToOne((type) => ExpertData, (expertData) => expertData.student, {
        nullable: true,
        cascade: true
    })
    expertData: ExpertData;

    /*
     * DaZ Data
     */
    @Column({nullable: true})
    supportsInDaZ: boolean;

    @Column({
        type: "enum",
        enum: Language,
        default: [],
        array: true
    })
    languages: Language[];

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

    @Column({
        type: 'enum',
        enum: RegistrationSource,
        default: RegistrationSource.NORMAL
    })
    registrationSource: RegistrationSource;

    @OneToMany(type => Course, course => course.correspondent, {
        nullable: true
    })
    managedCorrespondenceCourses: Course[];

    @OneToMany(type => CourseGuest, guest => guest.inviter, {
        cascade: true,
        nullable: true
    })
    invitedGuests: CourseGuest[];

    async setTutorScreeningResult(screeningInfo: ScreeningInfo, screener: Screener) {
        let currentScreening = await this.screening;

        if (!screeningInfo) {
            if (currentScreening) {
                await getManager().remove(currentScreening);
                this.screening = Promise.resolve(undefined);
            }
            return;
        }

        if (!currentScreening) {
            currentScreening = new Screening();
        }
        await currentScreening.updateScreeningInfo(screeningInfo, screener);
        this.screening = Promise.resolve(currentScreening);
    }

    async setInstructorScreeningResult(screeningInfo: ScreeningInfo, screener: Screener) {
        let currentScreening = await this.instructorScreening;

        if (!screeningInfo) {
            if (currentScreening) {
                await getManager().remove(currentScreening);
                this.instructorScreening = Promise.resolve(undefined);
            }
            return;
        }

        if (!currentScreening) {
            currentScreening = new InstructorScreening();
        }
        await currentScreening.updateScreeningInfo(screeningInfo, screener);
        this.instructorScreening = Promise.resolve(currentScreening);
    }

    async setProjectCoachingScreeningResult(screeningInfo: ScreeningInfo, screener: Screener) {
        let currentScreening = await this.projectCoachingScreening;

        if (!screeningInfo) {
            if (currentScreening) {
                await getManager().remove(currentScreening);
                this.projectCoachingScreening = Promise.resolve(undefined);
            }
            return;
        }

        if (!currentScreening) {
            currentScreening = new ProjectCoachingScreening();
        }
        await currentScreening.updateScreeningInfo(screeningInfo, screener);
        this.projectCoachingScreening = Promise.resolve(currentScreening);
    }

    // Use this method if you wanna set project fields of a student, because this method is able to set them safely without errors
    // also see https://github.com/typeorm/typeorm/issues/3801
    async setProjectFields(fields: ProjectFieldWithGradeInfoType[]) {
        //delete old project fields to prevent errors
        for (const pf of await this.projectFields ?? []) {
            await getManager().remove(pf);
        }
        //set new values
        this.projectFields = Promise.resolve(fields.map( f => new ProjectFieldWithGradeRestriction(f.name, f.min, f.max)));
    }
    async getProjectFields(): Promise<ProjectFieldWithGradeInfoType[]> {
        return (await this.projectFields).map(pf => {
            return {
                name: pf.projectField,
                min: pf.min,
                max: pf.max
            };
        });
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

    async projectCoachingScreeningStatus(): Promise<ScreeningStatus> {
        const projectCoachingScreening = await this.projectCoachingScreening;
        const studentScreening = await this.screening;

        if (!projectCoachingScreening && !studentScreening) {
            return ScreeningStatus.Unscreened;
        }
        //if someone is explicitly not allowed for project coaching, don't care whether he was accepted as a student for 1-on-1 tutoring
        if (projectCoachingScreening?.success === false) {
            return ScreeningStatus.Rejected;
        }

        //...otherwise beeing successfully screened as student is also sufficient.
        if (projectCoachingScreening?.success || studentScreening?.success) {
            return ScreeningStatus.Accepted;
        }

        return ScreeningStatus.Rejected;
    }

    //Returns the URL that the student can use to get to his screening video call
    screeningURL(): string {
        //for now, this is just static and does not dynamically depend on the student's email address (but this is planned for future, probably)
        return "https://authentication.lern-fair.de/";
    }

    instructorScreeningURL(): string {
        return "https://authentication.lern-fair.de/";
    }

    // Return the subjects formatted in the Subject Format
    getSubjectsFormatted(): Subject[] {
        try {
            return parseSubjectString(this.subjects);
        }
        catch (e) {
            throw new Error(`Invalid subject format string "${this.subjects}" for student with email ${this.email} found!`);
        }
    }
    setSubjectsFormatted(subjects: Subject[]) {
        this.subjects = JSON.stringify(subjects.map(toStudentSubjectDatabaseFormat));
    }

    isIntern(): boolean {
        return this.module === TeacherModule.INTERNSHIP;
    }
}

//re-export
export { Subject };

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

export const DEFAULT_PROJECT_COACH_GRADERESTRICTIONS = {
    MIN: 1,
    MAX: 13
};

export const DEFAULT_TUTORING_GRADERESTRICTIONS = {
    MIN: 1,
    MAX: 13
};