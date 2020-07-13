import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Index,
    CreateDateColumn
} from "typeorm";
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

    @CreateDateColumn({ type: "timestamp" })
    certificateDate: Date;

    @CreateDateColumn({ type: "timestamp" })
    startDate: Date;

    @CreateDateColumn({ type: "timestamp" })
    endDate: Date;

    @Column()
    hoursPerWeek: number;

    @Column()
    hoursTotal: number;

    @Column()
    medium: string;

    @ManyToOne((type) => Student)
    @JoinColumn()
    student: Student;

    @ManyToOne((type) => Pupil)
    @JoinColumn()
    pupil: Pupil;


}
