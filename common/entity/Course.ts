import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
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

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @ManyToMany(type => Student, student => student.courses)
    @JoinTable()
    instructors: Student;

    @Column()
    name: string;

    @Column()
    outline: string;

    @Column()
    description: string;

    @Column()
    motivation: string;

    @Column()
    requirements: string;

    @Column({
        nullable: true
    })
    imageUrl: string;

    @Column()
    categoryId: number;

    @ManyToMany(type => CourseTag, tag => tag.courses)
    @JoinTable()
    tags: Promise<CourseTag[]>

    @Column()
    joinAfterStart: boolean;

    @Column()
    subcourses: Promise<Subcourse[]>;

    @Column({
        type: "enum",
        enum: CourseState,
        default: CourseState.CREATED
    })
    courseState: CourseState;

}
