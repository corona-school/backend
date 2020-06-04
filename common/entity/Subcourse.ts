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

    @ManyToOne(type => Student, student => student.courses, {
        eager: true
    })
    @JoinColumn()
    instructors: Student[];

    @ManyToMany(type => Pupil, pupil => pupil.subcourses, {
        eager: true
    })
    @JoinTable()
    participants: Pupil[];

    @OneToMany(type => Lecture, lecture => lecture.subcourse, {
        eager: true
    })
    @Column()
    lectures: Lecture[];

    @OneToMany(type => Course, course => course.subcourses)
    course: Course;

    @Column()
    minGrade: number;

    @Column()
    maxGrade: number;

    @Column()
    maxParticipants: number;

    @Column()
    published: boolean;

    @Column({
        default: false
    })
    cancelled: boolean;

}
