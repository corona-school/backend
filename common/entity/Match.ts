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
import { gradeAsInt } from "../util/gradestrings";

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
}


export async function haveDissolvedMatch(s: Student, p: Pupil, manager: EntityManager) {
    return (await manager.find(Match, { student: s, pupil: p, dissolved: true })).length > 0;
}

export async function alreadyMatched(s: Student, p: Pupil, manager: EntityManager) {
    const matches = manager.find(Match, { student: s, pupil: p });

    return (await matches).length !== 0;
}
