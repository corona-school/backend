import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn, Unique,
    UpdateDateColumn
} from "typeorm";
import { Student } from "./Student";
import { Subcourse } from './Subcourse';
import { Course } from './Course';
import { Pupil } from './Pupil';

@Entity()
export class CourseTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    identifier: string;

    @ManyToMany(type => Course, course => course.tags)
    courses: Promise<Course[]>

    @ManyToMany(type => Pupil, pupil => pupil.tags)
    pupils: Promise<Pupil[]>

    @ManyToMany(type => Student, student => student.tags)
    students: Promise<Student[]>

}
