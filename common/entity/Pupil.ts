import { Column, Entity, EntityManager, Index, ManyToMany, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Match } from "./Match";
import { Person, RegistrationSource } from "./Person";
import { Subcourse } from './Subcourse';
import { State } from './State';
import { School } from './School';
import {CourseAttendanceLog} from "./CourseAttendanceLog";
import { SchoolType } from "./SchoolType";

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

    @OneToMany(type => CourseAttendanceLog, courseAttendanceLog => courseAttendanceLog.pupil)
    courseAttendanceLog: CourseAttendanceLog[];

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
