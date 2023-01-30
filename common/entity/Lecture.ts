import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Subcourse } from './Subcourse';
import { CourseAttendanceLog } from './CourseAttendanceLog';
import { OneToMany } from 'typeorm/index';
import { AbstractAppointment } from './AbstractAppointment';

@Entity()
export class Lecture extends AbstractAppointment {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne((type) => Student, (student) => student.lectures, {
        eager: true,
    })
    @JoinColumn()
    instructor: Student;

    @ManyToOne((type) => Subcourse, (subcourse) => subcourse.lectures, { nullable: true, eager: false })
    @JoinColumn()
    subcourse: Subcourse;

    @Column('timestamp')
    start: Date;

    @Column()
    duration: number;

    @OneToMany((type) => CourseAttendanceLog, (courseAttendanceLog) => courseAttendanceLog.lecture)
    courseAttendanceLog: CourseAttendanceLog[];
}
