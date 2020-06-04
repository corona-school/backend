import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Student } from "./Student";
import { Pupil } from './Pupil';
import { Subcourse } from './Subcourse';

@Entity()
export class Lecture {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @OneToMany(type => Student, student => student.lectures)
    instructor: Student;

    @ManyToOne(type => Subcourse, subcourse => subcourse.lectures)
    @JoinColumn()
    subcourse: Subcourse;

    @Column("timestamp")
    start: Date;

    @Column()
    duration: number;

}
