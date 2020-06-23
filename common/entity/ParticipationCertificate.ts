import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
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
    activities: string;

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

    @OneToOne((type) => Student)
    @JoinColumn()
    student: Student;

    @OneToOne((type) => Pupil)
    @JoinColumn()
    pupil: Pupil;


}
