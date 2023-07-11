import { Column, Entity, EntityManager, Index, ManyToMany, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Match } from './Match';
import { Person, RegistrationSource } from './Person';
import { Subcourse } from './Subcourse';
import { State } from './State';
import { School } from './School';
import { CourseAttendanceLog } from './CourseAttendanceLog';
import { SchoolType } from './SchoolType';
import { ProjectMatch } from './ProjectMatch';
import { LearningGermanSince } from '../daz/learningGermanSince';
import { Language } from '../daz/language';
import { PupilTutoringInterestConfirmationRequest } from './PupilTutoringInterestConfirmationRequest';
import { PupilScreening } from './PupilScreening';
import { WaitingListEnrollment } from './WaitingListEnrollment';
import { ProjectField } from './ProjectFieldWithGradeRestriction';

enum TuteeJufoParticipationIndication {
    YES = 'yes', //is a jufo participant
    NO = 'no', //is no jufo participant
    UNSURE = 'unsure', //still not sure whether she*he will participate
    NEVERHEARD = 'neverheard', //does not know Jufo
}

@Entity()
export class Pupil extends Person {
    /*
     * Management Data
     */
    @Column()
    @Index({
        unique: true,
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
        default: State.OTHER,
    })
    state: State;

    @Column({
        type: 'enum',
        enum: SchoolType,
        default: SchoolType.SONSTIGES,
    })
    schooltype: SchoolType;

    @Column({
        nullable: true,
    })
    msg: string;

    @Column({
        nullable: true,
    })
    grade: string;

    @Column({
        default: false,
    })
    newsletter: boolean;

    /*
     * Pupil data
     */
    @Column({
        default: false,
    })
    isPupil: boolean;

    @Column({
        nullable: true,
    })
    subjects: string;

    @OneToMany((type) => Match, (match) => match.pupil, { nullable: true })
    matches: Promise<Match[]>;

    @Column({
        nullable: false,
        default: 1,
    })
    openMatchRequestCount: number;

    @Column({ nullable: true })
    firstMatchRequest: Date;

    /*
     * Participant data
     */
    @Column({
        default: true,
    })
    isParticipant: boolean;

    @ManyToMany((type) => Subcourse, (subcourse) => subcourse.participants)
    subcourses: Subcourse[];

    @ManyToMany((type) => Subcourse, (subcourse) => subcourse.waitingList)
    queuedSubcourses: Subcourse[];

    @ManyToMany((type) => WaitingListEnrollment, (waitinglistenrollment) => waitinglistenrollment.pupil)
    waitingListEnrollments: WaitingListEnrollment[];

    @OneToMany((type) => CourseAttendanceLog, (courseAttendanceLog) => courseAttendanceLog.pupil)
    courseAttendanceLog: CourseAttendanceLog[];

    /*
     * Project Coaching data
     */
    @Column({
        default: false,
        nullable: false,
    })
    isProjectCoachee: boolean;

    @Column({
        type: 'enum',
        enum: ProjectField,
        default: [],
        nullable: false,
        array: true,
    })
    projectFields: ProjectField[];

    @Column({
        default: TuteeJufoParticipationIndication.UNSURE,
        nullable: false,
    })
    isJufoParticipant: TuteeJufoParticipationIndication;

    @Column({
        nullable: false,
        default: 1,
    })
    openProjectMatchRequestCount: number;

    @Column({
        nullable: false,
        default: 1,
    })
    projectMemberCount: number;

    @OneToMany((type) => ProjectMatch, (match) => match.pupil, { nullable: true })
    projectMatches: Promise<ProjectMatch[]>;

    /*
     * DaZ data
     */
    @Column({
        type: 'enum',
        enum: Language,
        default: [],
        array: true,
    })
    languages: Language[];

    @Column({
        type: 'enum',
        enum: LearningGermanSince,
        nullable: true,
    })
    learningGermanSince: LearningGermanSince;

    /*
     * Other data
     */
    @Column({
        nullable: false,
        default: 0, //everyone is default 0, i.e no priority
    })
    matchingPriority: number;

    // Holds the date of when some settings were last updated by a blocking popup (aka "blocker") in the frontend.
    // The frontend should set this value. It may be null, if it was never used by the frontend
    @Column({
        nullable: true,
        default: null,
    })
    lastUpdatedSettingsViaBlocker: Date;

    @ManyToOne((type) => School, (school) => school.pupils, {
        eager: true,
        nullable: true,
    })
    @JoinColumn()
    school: School;

    @Column({
        nullable: true,
        default: null,
    })
    teacherEmailAddress: string;

    @Column({
        type: 'enum',
        enum: RegistrationSource,
        default: RegistrationSource.NORMAL,
    })
    registrationSource: RegistrationSource;

    @OneToOne((type) => PupilTutoringInterestConfirmationRequest, (pticr) => pticr.pupil, {
        nullable: true,
        cascade: true,
    })
    tutoringInterestConfirmationRequest?: PupilTutoringInterestConfirmationRequest;

    @Column({
        nullable: true,
        default: null,
        unique: true,
    })
    coduToken: string;

    @Column({ default: '', nullable: false })
    aboutMe: string;

    @Column({ default: '', nullable: false })
    matchReason: string;

    @OneToMany(() => PupilScreening, (screening) => screening.pupil)
    screenings: PupilScreening[];
}
