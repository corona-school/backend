import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Student } from "./Student";
import { Subcourse } from './Subcourse';

@Entity()
export class Lecture {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @ManyToOne(type => Student, student => student.lectures, {
        eager: true
    })
    @JoinColumn()
    instructor: Student;

    @ManyToOne(type => Subcourse, subcourse => subcourse.lectures)
    @JoinColumn()
    subcourse: Subcourse;

    @Column("timestamp")
    start: Date;

    @Column()
    duration: number;

}
