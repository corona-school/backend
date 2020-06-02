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
import { Course } from './Course';
import { Lecture } from './Lecture';

@Entity()
export class Subcourse {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @ManyToOne(type => Student, student => student.courses)
    @JoinColumn()
    instructors: Student;

    @ManyToMany(type => Pupil, pupil => pupil.subcourses)
    @JoinTable()
    participants: Promise<Pupil[]>;

    @OneToMany(type => Lecture, lecture => lecture.subcourse)
    @Column()
    lectures: Promise<Subcourse[]>;

    @OneToMany(type => Course, course => course.subcourses)
    course: Course;

    @Column()
    minGrade: number;

    @Column()
    maxGrade: number;

    @Column()
    maxParticipants: number;

    @Column({
        default: false
    })
    cancelled: boolean;

}
