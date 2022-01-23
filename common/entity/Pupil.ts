import { Column, Entity, EntityManager, Index, ManyToMany, OneToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Match } from "./Match";
import { Person, RegistrationSource } from "./Person";
import { Subcourse } from './Subcourse';
import { State } from './State';
import { School } from './School';
import {CourseAttendanceLog} from "./CourseAttendanceLog";
import { SchoolType } from "./SchoolType";
import { ProjectField } from "../jufo/projectFields";
import { TuteeJufoParticipationIndication } from "../jufo/participationIndication";
import { ProjectMatch } from "./ProjectMatch";
import { gradeAsInt } from "../util/gradestrings";
import { Student, DEFAULT_PROJECT_COACH_GRADERESTRICTIONS, DEFAULT_TUTORING_GRADERESTRICTIONS } from "./Student";
import { parseSubjectString, Subject, toPupilSubjectDatabaseFormat } from "../util/subjectsutils";
import { LearningGermanSince } from "../daz/learningGermanSince";
import { Language } from "../daz/language";
import { PupilTutoringInterestConfirmationRequest } from "./PupilTutoringInterestConfirmationRequest";

@Entity()
export class Pupil extends Person {
    /*
     * Management Data
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
        type: 'enum',
        enum: State,
        default: State.OTHER
    })
    state: State;

    @Column({
        type: 'enum',
        enum: SchoolType,
        default: SchoolType.SONSTIGES
    })
    schooltype: SchoolType;

    @Column({
        nullable: true
    })
    msg: string;

    @Column({
        nullable: true
    })
    grade: string;

    @Column({
        default: false
    })
    newsletter: boolean;

    /*
     * Pupil data
     */
    @Column({
        default: false
    })
    isPupil: boolean;

    @Column({
        nullable: true
    })
    subjects: string;

    @OneToMany(type => Match, match => match.pupil, { nullable: true })
    matches: Promise<Match[]>;

    @Column({
        nullable: false,
        default: 1
    })
    openMatchRequestCount: number;

    /*
     * Participant data
     */
    @Column({
        default: true
    })
    isParticipant: boolean;

    @ManyToMany(type => Subcourse, subcourse => subcourse.participants)
    subcourses: Subcourse[];

    @ManyToMany(type => Subcourse, subcourse => subcourse.waitingList)
    queuedSubcourses: Subcourse[];

    @OneToMany(type => CourseAttendanceLog, courseAttendanceLog => courseAttendanceLog.pupil)
    courseAttendanceLog: CourseAttendanceLog[];

    /*
     * Project Coaching data
     */
    @Column({
        default: false,
        nullable: false
    })
    isProjectCoachee: boolean;

    @Column({
        type: "enum",
        enum: ProjectField,
        default: [],
        nullable: false,
        array: true
    })
    projectFields: ProjectField[];

    @Column({
        default: TuteeJufoParticipationIndication.UNSURE,
        nullable: false
    })
    isJufoParticipant: TuteeJufoParticipationIndication;

    @Column({
        nullable: false,
        default: 1
    })
    openProjectMatchRequestCount: number;

    @Column({
        nullable: false,
        default: 1
    })
    projectMemberCount: number;

    @OneToMany(type => ProjectMatch, match => match.pupil, { nullable: true })
    projectMatches: Promise<ProjectMatch[]>;

    /*
     * DaZ data
     */
    @Column({
        type: "enum",
        enum: Language,
        default: [],
        array: true
    })
    languages: Language[];

    @Column({
        type: "enum",
        enum: LearningGermanSince,
        nullable: true
    })
    learningGermanSince: LearningGermanSince;

    /*
     * Other data
     */
    @Column({
        nullable: false,
        default: 0 //everyone is default 0, i.e no priority
    })
    matchingPriority: number;

    // Holds the date of when some settings were last updated by a blocking popup (aka "blocker") in the frontend.
    // The frontend should set this value. It may be null, if it was never used by the frontend
    @Column({
        nullable: true,
        default: null
    })
    lastUpdatedSettingsViaBlocker: Date;

    @ManyToOne((type) => School, (school) => school.pupils, {
        eager: true,
        nullable: true
    })
    @JoinColumn()
    school: School;

    @Column({
        nullable: true,
        default: null
    })
    teacherEmailAddress: string;

    @Column({
        type: 'enum',
        enum: RegistrationSource,
        default: RegistrationSource.NORMAL
    })
    registrationSource: RegistrationSource;

    @OneToOne((type) => PupilTutoringInterestConfirmationRequest, (pticr) => pticr.pupil, {
        nullable: true,
        cascade: true
    })
    tutoringInterestConfirmationRequest?: PupilTutoringInterestConfirmationRequest;

    @Column({nullable: true, default: null})
    cToken: string;

    gradeAsNumber(): number | null {
        if (this.grade == null) {
            return null;
        }
        return gradeAsInt(this.grade);
    }
    setGradeAsNumber(newGrade: number) {
        this.grade = `${newGrade}. Klasse`;
    }

    assumedProjectCoachingMatchingGrade(): number {
        return this.gradeAsNumber() ?? 13; //if no grade is given (usually only for project coachees which have left the normal school and attend the "Berufsschule"), assume 13, because those people are usually older
    }

    async overlappingProjectFieldsWithCoach(coach: Student): Promise<ProjectField[]> {
        const fieldsCoach = await coach.getProjectFields();
        const pupilGrade = this.assumedProjectCoachingMatchingGrade();

        return this.projectFields.filter(f => fieldsCoach.some(fc => fc.name === f && (fc.min ?? DEFAULT_PROJECT_COACH_GRADERESTRICTIONS.MIN) <= pupilGrade && pupilGrade <= (fc.max ?? DEFAULT_PROJECT_COACH_GRADERESTRICTIONS.MAX)));
    }

    getSubjectsFormatted(): Subject[] {
        try {
            return parseSubjectString(this.subjects);
        } catch (e) {
            throw new Error(`Invalid subject format string "${this.subjects}" for pupil with email ${this.email} found!`);
        }
    }
    setSubjectsFormatted(subjects: Subject[]) {
        this.subjects = JSON.stringify(subjects.map(toPupilSubjectDatabaseFormat));
    }

    overlappingSubjectsWithTutor(tutor: Student): Subject[] {
        const tutorSubjects = tutor.getSubjectsFormatted();
        const tuteeSubjects = this.getSubjectsFormatted();

        const tuteeGrade = this.gradeAsNumber();

        return tuteeSubjects.filter(tuteeS => tutorSubjects.some(tutorS => tuteeS.name === tutorS.name && (tutorS.grade?.min ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MIN) <= tuteeGrade && tuteeGrade <= (tutorS.grade?.max ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MAX)));
    }
}

export function getPupilWithEmail(manager: EntityManager, email: string) {
    return manager.findOne(Pupil, { email: email });
}

export function getPupilByWixID(manager: EntityManager, wixID: string) {
    return manager.findOne(Pupil, { wix_id: wixID });
}

export async function activeMatchesOfPupil(p: Pupil, manager: EntityManager) {
    return (await p.matches).filter((m) => m.dissolved === false);
}

export async function activeMatchCountOfPupil(
    p: Pupil,
    manager: EntityManager
) {
    return (await activeMatchesOfPupil(p, manager)).length;
}
