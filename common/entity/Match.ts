import {
    Column,
    CreateDateColumn,
    Entity,
    EntityManager,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from "typeorm";
import { Student } from "./Student";
import { Pupil } from "./Pupil";
import { Subject } from "../util/subjectsutils";
import { v4 as generateUUID } from "uuid";

export enum SourceType {
    IMPORTED = "imported",
    MATCHEDEXTERNAL = "matchedexternal", //by mathematical algo
    MATCHEDINTERNAL = "matchedinternal",
}

@Entity()
@Unique("UQ_MATCH", ["student", "pupil"])
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    uuid: string;

    /*
     * Possible values:
     *   0:  The match has been dissolved, because a member deactivated his account
     */
    @Column({
        default: false
    })
    dissolved: boolean;

    @Column({
        default: null,
        nullable: true
    })
    dissolveReason: number;

    @Column({
        nullable: true
    })
    proposedTime: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @ManyToOne((type) => Student, (student) => student.matches, {
        eager: true
    })
    @JoinColumn()
    student: Student;

    @ManyToOne((type) => Pupil, (pupil) => pupil.matches, {
        eager: true
    })
    @JoinColumn()
    pupil: Pupil;

    //all emails that were sent associated with this match (i.e. emails about confirming the match, dissolving it, etc. )
    @Column({
        default: false
    })
    feedbackToPupilMail: boolean;

    @Column({
        default: false
    })
    feedbackToStudentMail: boolean;

    @Column({
        default: false
    })
    followUpToPupilMail: boolean;

    @Column({
        default: false
    })
    followUpToStudentMail: boolean;

    @Column({
        type: "enum",
        enum: SourceType,
        default: SourceType.MATCHEDINTERNAL
    })
    source: SourceType; //stores if the match was imported from the old Database and not matched in the system itself

    // Students and Pupils request a match by increasing their "openMatchRequest" counter
    // A match decreases that counter. Thus we cannot really say 'which request lead to which match'
    // However we know when the user last increased the match count
    @Column({ nullable: true })
    studentLastMatchRequest: Date;

    @Column({ nullable: true })
    pupilLastMatchRequest: Date;

    jitsiLink(): string {
        return `https://meet.jit.si/CoronaSchool-${encodeURIComponent(this.uuid)}`;
    }

    overlappingSubjects(): Subject[] {
        return this.pupil.overlappingSubjectsWithTutor(this.student);
    }

    constructor(pupil: Pupil, student: Student, uuid: string = generateUUID()) {
        this.pupil = pupil;
        this.student = student;
        this.uuid = uuid;
    }
}


export async function haveDissolvedMatch(s: Student, p: Pupil, manager: EntityManager) {
    return (await manager.find(Match, { student: s, pupil: p, dissolved: true })).length > 0;
}

export async function alreadyMatched(s: Student, p: Pupil, manager: EntityManager) {
    const matches = manager.find(Match, { student: s, pupil: p });

    return (await matches).length !== 0;
}

export async function getMatchByID(id: number, manager: EntityManager): Promise<Match> {
    return manager.findOne(Match, {
        id: id
    });
}

///Takes the given matches instances and re-queries them from the database, returning new instances for all of them.
export async function reloadMatchesInstances(matches: Match[], manager: EntityManager): Promise<Match[]> {
    return await Promise.all(matches.map(async m => await getMatchByID(m.id, manager)));
}

/// An interface that can be used if someone wants to represent a match just as a pair of student and pupil (without additional match metadata). Every Match is also a MatchPair
export interface MatchPair {
    student: Student;
    pupil: Pupil;
}
