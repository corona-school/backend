import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, getManager } from 'typeorm';
import { Student } from './Student';
import { Subcourse } from './Subcourse';
import { CourseTag } from './CourseTag';
import { ApiCourseUpdate } from '../dto/ApiCourseUpdate';
import { createCourseTag } from '../util/createCourseTag';
import { accessURLForKey } from '../file-bucket/s3';
import { CourseGuest } from './CourseGuest';
import {SchoolType} from "./SchoolType";
import {Subject} from "./Subject";

export enum CourseState {
    CREATED = 'created',
    SUBMITTED = 'submitted',
    ALLOWED = 'allowed',
    DENIED = 'denied',
    CANCELLED = 'cancelled',
}

export enum CourseCategory {
    REVISION = 'revision',
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


    @Column({nullable: true, type: 'enum', enum: Subject})
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

    async updateCourse(update: ApiCourseUpdate) {
        if (!update.isValid()) {
            throw new Error('Cannot use invalid ApiCourseUpdate to update course!');
        }

        if (update.instructors) {
            update.instructors = await Promise.all(
                update.instructors.map((it) => getManager().findOneOrFail(Student, { where: { id: it.id, isInstructor: true } }))
            );
        }

        for (const [key, value] of Object.entries(update)) {
            if (typeof value !== 'undefined') {
                this[key] = value;
            }
        }
    }

    async updateTags(tags: { identifier?: string; name?: string }[]) {
        let newTags: CourseTag[] = [];
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].identifier) {
                newTags.push(
                    await getManager()
                        .findOneOrFail(CourseTag, { where: { identifier: tags[i].identifier } })
                        .catch(async () => await createCourseTag(tags[i].name, this.category))
                );
            } else {
                newTags.push(await createCourseTag(tags[i].name, this.category));
            }
        }

        this.tags = newTags;
    }

    imageURL(): string | null {
        return this.imageKey ? accessURLForKey(this.imageKey) : null;
    }
}
