import {
    Column,
    CreateDateColumn,
    Entity, getManager,
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

    @ManyToMany(type => Student, student => student.subcourses, {
        eager: true
    })
    @JoinTable()
    instructors: Student[];

    @ManyToMany(type => Pupil, pupil => pupil.subcourses, {
        eager: true
    })
    @JoinTable()
    participants: Pupil[];

    @ManyToMany(type => Pupil, pupil => pupil.queuedSubcourses, {
        eager: true
    })
    @JoinTable()
    waitingList: Pupil[];

    @OneToMany(type => Lecture, lecture => lecture.subcourse, {
        eager: true
    })
    lectures: Lecture[];

    @ManyToOne(type => Course, course => course.subcourses)
    @JoinColumn()
    course: Course;

    @Column()
    minGrade: number;

    @Column()
    maxGrade: number;

    @Column()
    maxParticipants: number;

    @Column({
        default: false
    })
    joinAfterStart: boolean;

    @Column()
    published: boolean;

    @Column({
        default: false
    })
    cancelled: boolean;

    async addLecture(newLecture: {start: Date, duration: number, instructor: { id: number } }){
        const instructor = this.instructors.find(it => it.id === newLecture.instructor.id);

        if (!instructor) {
            throw new Error("Student is not instructor of this subcourse.");
        }

        const lecture = new Lecture();
        lecture.instructor = instructor;
        lecture.start = newLecture.start;
        lecture.duration = newLecture.duration;

        await getManager().save(Lecture, lecture);
        this.lectures.push(lecture);
    }

    firstLecture(): Lecture {
        return this.lectures?.sort( (a, b) => a.start.getTime() - b.start.getTime())[0];
    }

    isPupilOnWaitingList(pupil: Pupil): boolean {
        return this.waitingList?.some(p => p.id === pupil.id);
    }

    addPupilToWaitingList(pupil: Pupil) {
        if (!this.waitingList) {
            this.waitingList = [];
        }
        this.waitingList.push(pupil);
    }
    removePupilFromWaitingList(pupil: Pupil) {
        this.waitingList = this.waitingList?.filter(p => p.id !== pupil.id);
    }

}
