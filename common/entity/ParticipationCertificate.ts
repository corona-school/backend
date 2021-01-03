import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./Student";
import { Pupil } from "./Pupil";

@Entity()
export class ParticipationCertificate {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    uuid: string;

    @Column()
    subjects: string;

    @Column()
    categories: string;

    @Column({
        default: () => "now()",
        nullable: false
    })
    certificateDate: Date;

    @Column({
        default: () => "now()",
        nullable: false
    })
    startDate: Date;

    @Column({
        default: () => "now()",
        nullable: false
    })
    endDate: Date;

    @Column({
        type: "decimal"
    })
    hoursPerWeek: number;

    @Column({
        type: "decimal"
    })
    hoursTotal: number;

    @Column()
    medium: string;

    @ManyToOne((type) => Student)
    @JoinColumn()
    student: Student;

    @ManyToOne((type) => Pupil)
    @JoinColumn()
    pupil: Pupil;

    @Column({ default: false })
    ongoingLessons: boolean;

    @Column({ default: "manual" })
    state: "manual" | "awaiting-approval" | "approved";

    @Column({ nullable: true, type: "bytea", select: false })
    signaturePupil?: Buffer;

    @Column({ nullable: true, type: "bytea", select: false })
    signatureParent?: Buffer;
}
