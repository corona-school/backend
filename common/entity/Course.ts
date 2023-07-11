import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, getManager } from 'typeorm';
import { Student } from './Student';
import { Subcourse } from './Subcourse';
import { CourseTag } from './CourseTag';
import { CourseGuest } from './CourseGuest';
import { SchoolType } from './SchoolType';
import { Subject } from './Subject';

export enum CourseState {
    CREATED = 'created',
    SUBMITTED = 'submitted',
    ALLOWED = 'allowed',
    DENIED = 'denied',
    CANCELLED = 'cancelled',
}

export enum CourseCategory {
    LANGUAGE = 'language',
    FOCUS = 'focus',
    REVISION = 'revision',
    /* DEPRECATED: These have been used a while ago with differening semantics: */
    CLUB = 'club',
    COACHING = 'coaching',
}

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToMany((type) => Student, (student) => student.courses, {
        eager: true,
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
        nullable: true,
    })
    imageKey: string; //note, it will not store the full url, but just the key of the file in the corresponding default bucket

    @Column({
        type: 'enum',
        enum: CourseCategory,
        nullable: false,
    })
    category: CourseCategory;

    @Column({ nullable: true, type: 'enum', enum: Subject })
    subject: Subject;

    @Column({
        type: 'enum',
        enum: SchoolType,
        array: true,
        default: [SchoolType.SONSTIGES],
    })
    schooltype: SchoolType[];

    @ManyToMany((type) => CourseTag, (tag) => tag.courses, {
        eager: true,
    })
    @JoinTable()
    tags: CourseTag[];

    @OneToMany((type) => Subcourse, (subcourse) => subcourse.course, {
        eager: true,
    })
    subcourses: Subcourse[];

    @Column({
        type: 'enum',
        enum: CourseState,
        default: CourseState.CREATED,
    })
    courseState: CourseState;

    @Column({ nullable: true })
    screeningComment: string;

    @Column({
        nullable: false,
        default: 0,
    })
    publicRanking: number;

    @Column({
        nullable: false,
        default: false,
    })
    allowContact: boolean;

    @ManyToOne((type) => Student, (student) => student.managedCorrespondenceCourses, {
        eager: true,
    })
    correspondent?: Student;

    @OneToMany((type) => CourseGuest, (guests) => guests.course)
    guests: CourseGuest[];
}
