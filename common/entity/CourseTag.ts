/* eslint-disable import/no-cycle */
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';

@Entity()
export class CourseTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({
        unique: true,
    })
    @Column()
    identifier: string;

    @Column()
    name: string;

    @Column()
    category: string;

    @ManyToMany((type) => Course, (course) => course.tags)
    courses: Course[];
}
