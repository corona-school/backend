import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn
} from "typeorm";
import {Student} from "./Student";
import {Pupil} from "./Pupil";
import {Course} from "./Course";
import {Subcourse} from "./Subcourse";
import {Lecture} from "./Lecture";
import {JoinColumn, OneToOne} from "typeorm/index";

@Entity()
export class CourseAttendanceLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: () => "NOW()"
    })
    createdAt: Date;

    @Column({ type: "timestamp", nullable: true })
    updatedAt: Date;

    @Column({ nullable: true })
    attendedTime: number;

    @Column({ nullable: true })
    ip: string;

    @ManyToOne(type => Pupil, pupil => pupil.courseAttendanceLog, {onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    pupil: Pupil;

    @ManyToOne(type => Subcourse, subcourse => subcourse.courseAttendanceLog, {onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    subcourse: Subcourse;

    @ManyToOne(type => Lecture, lecture => lecture.courseAttendanceLog, {onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    @JoinColumn()
    lecture: Lecture;

}
