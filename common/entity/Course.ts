import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    getManager
} from "typeorm";
import { Student } from "./Student";
import { Subcourse } from './Subcourse';
import { CourseTag } from './CourseTag';
import { ApiCourseUpdate } from "../../common/dto/ApiCourseUpdate";
import {randomBytes} from "crypto";
import {getLogger} from "log4js";


const logger = getLogger();

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

    @Column({ nullable: true })
    screeningComment: string;

    @Column({
        nullable: false,
        default: 0
    })
    publicRanking: number;

    async updateCourse(update: ApiCourseUpdate) {
        if (!update.isValid())
            throw new Error("Cannot use invalid ApiCourseUpdate to update course!");

        if (update.instructors)
            update.instructors = await Promise.all(update.instructors.map(it => getManager().findOneOrFail(Student, { where: { id: it.id, isInstructor: true }})));

        for (const [key, value] of Object.entries(update)) {
            if (typeof value !== "undefined")
                this[key] = value;
        }
    }

    async newTag(name: string) {
        let identifier = name.toLowerCase().replace(/\s/g, "");
        while (await getManager().findOne(CourseTag, { where: { identifier }})) {
            identifier = name.toLowerCase().replace(/\s/g, "") + randomBytes(1).toString('hex').toLowerCase();
        }

        let tag = new CourseTag();

        tag.identifier = identifier;
        tag.name = name;
        tag.category = 'other'; // Currently we don't know what to do with the category field

        await getManager().save(CourseTag, tag);

        return tag;
    }

    async updateTags(tags: { identifier?: string, name?: string }[]) {
        let newTags: CourseTag[] = [];
        for (let i = 0; i < tags.length; i++){
            if (tags[i].identifier) {
                newTags.push(await getManager()
                    .findOneOrFail(CourseTag, { where: { identifier: tags[i].identifier }})
                    .catch(async () => (await this.newTag(tags[i].name)))
                );
            } else {
                newTags.push(await this.newTag(tags[i].name));
            }
        }

        this.tags = newTags;
    }

}
