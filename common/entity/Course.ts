import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Student } from "./Student";
import { Subcourse } from './Subcourse';
import { CourseTag } from './CourseTag';

export enum CourseState {
    CREATED = "created",
    SUBMITTED = "submitted",
    ALLOWED = "allowed",
    DENIED = "denied",
    CANCELLED = "cancelled"
}

export enum CourseCategory {
    REVISION = 'revision',
    CLUB = 'club',
    COACHING = 'coaching'
}

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @ManyToMany(type => Student, student => student.courses, {
        eager: true
    })
    @JoinTable()
    instructors: Student[];

    @Column()
    name: string;

    @Column()
    outline: string;

    @Column()
    description: string;

    @Column({
        nullable: true
    })
    imageUrl: string;

    @Column({
        type: 'enum',
        enum: CourseCategory,
        nullable: false
    })
    category: CourseCategory;

    @ManyToMany(type => CourseTag, tag => tag.courses, {
        eager: true
    })
    @JoinTable()
    tags: CourseTag[];

    @OneToMany(type => Subcourse, subcourse => subcourse.course, {
        eager: true
    })
    subcourses: Subcourse[];

    @Column({
        type: "enum",
        enum: CourseState,
        default: CourseState.CREATED
    })
    courseState: CourseState;

}
