import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToOne
} from "typeorm";
import {Student} from "./Student";
import {Pupil} from "./Pupil";
import {Course} from "./Course";

@Entity()
export class CourseAttendanceLogging {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Column()
    ip: string;

    @ManyToOne(type => Pupil, pupil => pupil.courseAttendanceLogging)
    pupil: Pupil;

    @ManyToOne(type => Course, course => course.courseAttendanceLogging)
    course: Course;

}
