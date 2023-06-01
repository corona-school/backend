import {
    Column,
    CreateDateColumn,
    Entity,
    getManager,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Student } from './Student';
import { Pupil } from './Pupil';
import { Course } from './Course';
import { Lecture } from './Lecture';
import moment from 'moment';
import { ChatType } from '../chat/types';
import { WaitingListEnrollment } from './WaitingListEnrollment';

@Entity()
export class Subcourse {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToMany((type) => Student, (student) => student.subcourses, {
        eager: true,
    })
    @JoinTable()
    instructors: Student[];

    @ManyToMany((type) => Pupil, (pupil) => pupil.subcourses, {
        eager: true,
    })
    @JoinTable()
    participants: Pupil[];

    @ManyToMany((type) => Pupil, (pupil) => pupil.queuedSubcourses, {
        eager: true,
    })
    @JoinTable()
    waitingList: Pupil[];

    @OneToMany(() => WaitingListEnrollment, (enrollment) => enrollment.subcourse)
    waitingListEnrollments: WaitingListEnrollment[];

    @OneToMany((type) => Lecture, (lecture) => lecture.subcourse, {
        eager: true,
    })
    lectures: Lecture[];

    @ManyToOne((type) => Course, (course) => course.subcourses)
    @JoinColumn()
    course: Course;

    @Column()
    minGrade: number;

    @Column()
    maxGrade: number;

    @Column()
    maxParticipants: number;

    @Column({
        default: false,
    })
    joinAfterStart: boolean;

    @Column()
    published: boolean;

    @Column({ type: 'timestamp', nullable: true, default: null })
    publishedAt: Date;

    @Column({
        default: false,
    })
    cancelled: boolean;

    @Column({
        type: 'boolean',
        default: false,
    })
    alreadyPromoted: boolean;

    @Column({
        nullable: true,
    })
    conversationId: string;
    @Column({ type: 'boolean', default: true })
    allowChatContactProspects: boolean;

    @Column({ type: 'boolean', default: true })
    allowChatContactParticipants: boolean;

    @Column({ type: 'enum', enum: ChatType, enumName: 'chat_type', default: ChatType.NORMAL })
    groupChatType: ChatType;

    async addLecture(newLecture: { start: Date; duration: number; instructor: { id: number } }) {
        const instructor = this.instructors.find((it) => it.id === newLecture.instructor.id);

        if (!instructor) {
            throw new Error('Student is not instructor of this subcourse.');
        }

        const lecture = new Lecture();
        lecture.instructor = instructor;
        lecture.start = newLecture.start;
        lecture.duration = newLecture.duration;

        await getManager().save(Lecture, lecture);
        this.lectures.push(lecture);
    }

    sortedLectures(): Lecture[] {
        return this.lectures?.sort((a, b) => a.start.getTime() - b.start.getTime());
    }

    firstLecture(): Lecture {
        return this.sortedLectures()?.[0];
    }
    lastLecture(): Lecture {
        return this.sortedLectures()?.[this.lectures.length - 1];
    }

    isPupilOnWaitingList(pupil: Pupil): boolean {
        return this.waitingList?.some((p) => p.id === pupil.id);
    }

    addPupilToWaitingList(pupil: Pupil) {
        if (!this.waitingList) {
            this.waitingList = [];
        }
        this.waitingList.push(pupil);
    }
    removePupilFromWaitingList(pupil: Pupil) {
        this.waitingList = this.waitingList?.filter((p) => p.id !== pupil.id);
    }

    isActiveSubcourse(): boolean {
        const lastLecture = this.lastLecture();
        if (!lastLecture) {
            return false; //then active by default
        }

        return moment().isBefore(moment(lastLecture.start).add(lastLecture.duration, 'minutes'));
    }

    ///Returns the total duration in minutes
    totalDuration(): number {
        return this.lectures.reduce((prev, curr) => prev + curr.duration, 0);
    }
}
