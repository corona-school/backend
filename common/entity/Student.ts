import { Column, Entity, EntityManager, Index, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Match } from './Match';
import { Screening } from './Screening';
import { Person, RegistrationSource } from './Person';
import { Course } from './Course';
import { Lecture } from './Lecture';
import { State } from './State';
import { Subcourse } from './Subcourse';
import { InstructorScreening } from './InstructorScreening';
import { ProjectFieldWithGradeRestriction } from './ProjectFieldWithGradeRestriction';
import { ProjectCoachingScreening } from './ProjectCoachingScreening';
import { ScreeningInfo } from '../util/screening';
import { Screener } from './Screener';
import { JufoVerificationTransmission } from './JufoVerificationTransmission';
import { ProjectMatch } from './ProjectMatch';
import { ExpertData } from './ExpertData';
import { CourseGuest } from './CourseGuest';
import { Language } from '../daz/language';
import * as Notification from '../notification';
import { RemissionRequest } from './RemissionRequest';
import { CertificateOfConduct } from './CertificateOfConduct';

enum TutorJufoParticipationIndication {
    YES = 'yes', //was past jufo participant
    NO = 'no', //was no past jufo participant
    IDK = 'idk', //don't know whether she*he was jufo participant
}

export enum TeacherModule {
    INTERNSHIP = 'internship',
    SEMINAR = 'seminar',
    OTHER = 'other',
}

@Entity()
export class Student extends Person {
    /*
     * Management data
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
        nullable: true,
    })
    phone: string;

    @Column({
        nullable: true,
    })
    feedback: string;

    @Column({
        default: false,
    })
    newsletter: boolean;

    /*
     *  Student data
     */

    // This should really rather be "isTutor" cause that's what it means: the user wants to do one on one tutoring
    // ATTENTION: This does not mean the user is authorized to do tutoring. A successful screening record must exist for the user
    @Column({
        default: false,
    })
    isStudent: boolean;

    @Column({
        nullable: true,
    })
    subjects: string;

    @OneToMany((type) => Match, (match) => match.student, {
        nullable: true,
    })
    matches: Promise<Match[]>;

    @Column({
        nullable: false,
        default: 1,
    })
    openMatchRequestCount: number;

    @Column({ nullable: true })
    firstMatchRequest: Date;

    @Column({ default: false })
    isCodu: boolean;

    /*
     * Instructor data
     */
    // The user expressed the intent to instruct courses
    // ATTENTION: This does not mean the user is authorized to create courses. A successful instructor_screening record must exist for the user
    @Column({
        default: false,
    })
    isInstructor: boolean;

    @ManyToMany((type) => Course, (course) => course.instructors)
    courses: Course[];

    @ManyToMany((type) => Subcourse, (subcourse) => subcourse.instructors)
    subcourses: Subcourse[];

    @OneToMany((type) => Lecture, (lecture) => lecture.instructor)
    lectures: Lecture[];

    @Column({
        nullable: true,
    })
    msg: string;

    /*
     * Intern data
     */
    @Column({
        type: 'enum',
        enum: State,
        nullable: true,
        default: State.OTHER,
    })
    state: State;

    @Column({
        nullable: true,
    })
    university: string;

    @Column({
        type: 'enum',
        enum: TeacherModule,
        nullable: true,
        default: undefined, // See typeorm/typeorm#5371: Setting this to null causes typeORM to generate 'null' as a string.
        // This is fine for now because enums in postgres are DEFAULT NULL anyways
    })
    module: TeacherModule;

    @Column({
        nullable: true,
    })
    moduleHours: number;

    /*
     * Project Coaching data
     */
    // THe user expressed the intent to do project coaching
    // ATTENTION: This does not mean the user is authorized to do tutoring. A successful screening record must exist for the user (same screening as for tutors)
    @Column({
        default: false,
        nullable: false,
    })
    isProjectCoach: boolean;

    @OneToMany((type) => ProjectFieldWithGradeRestriction, (field) => field.student, {
        cascade: true,
    })
    projectFields: Promise<ProjectFieldWithGradeRestriction[]>;

    @Column({
        default: null,
        nullable: true,
    })
    wasJufoParticipant: TutorJufoParticipationIndication;

    @Column({
        default: null,
        nullable: true,
    })
    hasJufoCertificate: boolean;

    @Column({
        default: null,
        nullable: true,
    })
    jufoPastParticipationInfo: string;

    @Column({
        default: null,
        nullable: true,
    })
    jufoPastParticipationConfirmed: boolean;

    @Column({
        default: null,
        nullable: true,
    })
    isUniversityStudent: boolean;

    @Column({
        nullable: false,
        default: 1,
    })
    openProjectMatchRequestCount: number;

    @OneToOne((type) => ProjectCoachingScreening, (projectCoachingScreening) => projectCoachingScreening.student, {
        nullable: true,
        cascade: true,
    })
    projectCoachingScreening: Promise<ProjectCoachingScreening>;

    @OneToOne((type) => CertificateOfConduct, (cocScreening) => cocScreening.student, {
        nullable: true,
        cascade: true,
    })
    certificateOfConduct: Promise<CertificateOfConduct>;

    @Column({
        nullable: false,
        default: 0,
    })
    sentJufoAlumniScreeningReminderCount: number; //a counter for counting the screening reminders sent to Jufo alumni (which are not offically registered university students)

    @Column({
        nullable: true,
        default: null,
    })
    lastSentJufoAlumniScreeningInvitationDate: Date;

    @OneToOne((type) => JufoVerificationTransmission, (jufoVerificationTransmission) => jufoVerificationTransmission.student, {
        nullable: true,
        cascade: true,
    })
    jufoVerificationTransmission: JufoVerificationTransmission;

    @OneToMany((type) => ProjectMatch, (match) => match.student, { nullable: true })
    projectMatches: Promise<ProjectMatch[]>;

    @OneToOne((type) => ExpertData, (expertData) => expertData.student, {
        nullable: true,
        cascade: true,
    })
    expertData: ExpertData;

    /*
     * DaZ Data
     */
    @Column({ nullable: true })
    supportsInDaZ: boolean;

    @Column({
        type: 'enum',
        enum: Language,
        default: [],
        array: true,
    })
    languages: Language[];

    /*
     * Other data
     */
    @OneToOne((type) => Screening, (screening) => screening.student, {
        nullable: true,
        cascade: true,
    })
    screening: Promise<Screening>;

    @Column({
        nullable: false,
        default: 0,
    })
    sentScreeningReminderCount: number;

    @Column({
        nullable: true,
        default: null,
    })
    lastSentScreeningInvitationDate: Date;

    @OneToOne((type) => InstructorScreening, (instructorScreening) => instructorScreening.student, {
        nullable: true,
        cascade: true,
    })
    instructorScreening: Promise<InstructorScreening>;

    @Column({
        nullable: false,
        default: 0,
    })
    sentInstructorScreeningReminderCount: number;

    @Column({
        nullable: true,
        default: null,
    })
    lastSentInstructorScreeningInvitationDate: Date;

    //Pupils have the same column
    @Column({
        nullable: true,
        default: null,
    })
    lastUpdatedSettingsViaBlocker: Date;

    @Column({
        type: 'enum',
        enum: RegistrationSource,
        default: RegistrationSource.NORMAL,
    })
    registrationSource: RegistrationSource;

    @OneToMany((type) => Course, (course) => course.correspondent, {
        nullable: true,
    })
    managedCorrespondenceCourses: Course[];

    @OneToMany((type) => CourseGuest, (guest) => guest.inviter, {
        cascade: true,
        nullable: true,
    })
    invitedGuests: CourseGuest[];

    @OneToOne((type) => RemissionRequest, (remissionRequest) => remissionRequest.student, {
        nullable: true,
    })
    remissionRequest: RemissionRequest;

    @Column({ default: '', nullable: false })
    aboutMe: string;

    @Column({ default: null, nullable: true })
    zoomUserId: string;
}

export const DEFAULT_PROJECT_COACH_GRADERESTRICTIONS = {
    MIN: 1,
    MAX: 13,
};

export const DEFAULT_TUTORING_GRADERESTRICTIONS = {
    MIN: 1,
    MAX: 13,
};
