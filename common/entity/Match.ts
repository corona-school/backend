import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    Index,
    UpdateDateColumn,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    Unique,
    EntityManager,
} from "typeorm";
import { Student } from "./Student";
import { Pupil } from "./Pupil";
import { Mail } from "./Mail";
import {
    intersectionWithRespectToGrade,
    subjectsAsArray,
} from "../../jobs/backend/matching/subjectsutils";
import { gradeAsInt } from "../../jobs/backend/utils";

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
        default: false,
    })
    dissolved: boolean;

    @Column({
        default: null,
        nullable: true,
    })
    dissolveReason: number;

    @Column({
        nullable: true,
    })
    proposedTime: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @ManyToOne((type) => Student, (student) => student.matches, {
        eager: true,
    })
    @JoinColumn()
    student: Student;

    @ManyToOne((type) => Pupil, (pupil) => pupil.matches, {
        eager: true,
    })
    @JoinColumn()
    pupil: Pupil;

    //all emails that were sent associated with this match (i.e. emails about confirming the match, dissolving it, etc. )
    @OneToOne((type) => Mail, { nullable: true })
    @JoinColumn()
    confirmationToStudentMail: Promise<Mail>;

    @OneToOne((type) => Mail, { nullable: true })
    @JoinColumn()
    confirmationToPupilMail: Promise<Mail>;

    @OneToOne((type) => Mail, { nullable: true })
    @JoinColumn()
    dissolutionToStudentMail: Promise<Mail>;

    @OneToOne((type) => Mail, { nullable: true })
    @JoinColumn()
    dissolutionToPupilMail: Promise<Mail>;

    @OneToOne((type) => Mail, { nullable: true })
    @JoinColumn()
    feedbackToPupilMail: Promise<Mail>;

    @OneToOne((type) => Mail, { nullable: true })
    @JoinColumn()
    feedbackToStudentMail: Promise<Mail>;

    @Column({
        default: false,
    })
    automaticMailsForConfirmationDisabled: boolean; //if that is true, the system should not automatically send pending confirmation emails to the match -> this is primarily important for importing old matches

    @Column({
        default: false,
    })
    automaticMailsForDissolutionDisabled: boolean;

    @Column({
        default: false,
    })
    automaticMailsForFeedbackDisabled: boolean;

    @Column({
        type: "enum",
        enum: SourceType,
        default: SourceType.MATCHEDINTERNAL,
    })
    source: SourceType; //stores if the match was imported from the old Database and not matched in the system itself
}

export function subjectIntersectionOfMatch(m: Match) {
    return intersectionWithRespectToGrade(
        subjectsAsArray(m.student.subjects),
        subjectsAsArray(m.pupil.subjects),
        gradeAsInt(m.pupil.grade)
    );
}

export async function haveDissolvedMatch(
    s: Student,
    p: Pupil,
    manager: EntityManager
) {
    return (
        (
            await manager.find(Match, {
                student: s,
                pupil: p,
                dissolved: true,
            })
        ).length > 0
    );
}

export async function alreadyMatched(
    s: Student,
    p: Pupil,
    manager: EntityManager
) {
    const matches = manager.find(Match, {
        student: s,
        pupil: p,
    });

    return (await matches).length !== 0;
}
