import {
    Column,
    CreateDateColumn,
    Entity, Index,
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

    @Index({
        unique: true
    })
    @Column()
    identifier: string;

    @Column()
    category: string;

    @ManyToMany(type => Course, course => course.tags)
    courses: Course[];

}
