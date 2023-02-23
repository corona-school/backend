import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Subcourse } from './Subcourse';
import { CourseAttendanceLog } from './CourseAttendanceLog';
import { OneToMany } from 'typeorm/index';
import { Match } from './Match';
import { Pupil } from './Pupil';
import { Screener } from './Screener';
import { lecture_appointmenttype_enum } from '@prisma/client';

@Entity()
export class Lecture {
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

    // Here starts the new code related to Appointment

    @Column({ type: 'text', nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: lecture_appointmenttype_enum,
        nullable: false,
        default: lecture_appointmenttype_enum.legacy_lecture,
    })
    appointmentType: lecture_appointmenttype_enum;

    @Column({
        nullable: true,
    })
    meetingLink: string;

    @Column({
        nullable: true, //@TODO: probably should be changed with new migratioons
        default: false,
    })
    isCanceled: boolean;

    @ManyToOne((type) => Match, (match) => match.appointments, {
        eager: true,
        nullable: true,
    })
    @JoinColumn()
    match: Match;

    /**
     * for group and match appointments there should be only one organizer
     * for future types of appointments there might be multiple organizers
     */
    @ManyToMany((type) => Student, (student) => student.appointmentsOrganizer, {
        eager: true,
        nullable: false,
    })
    @JoinTable({
        name: 'appointment_organizer',
        joinColumn: { name: 'appointmentId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
    })
    organizers: Student[];

    @ManyToMany((type) => Pupil, (pupil) => pupil.appointments, {
        eager: true,
    })
    @JoinTable({
        name: 'appointment_participant_pupil',
        joinColumn: { name: 'appointmentId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'pupilId', referencedColumnName: 'id' },
    })
    participantsPupils: Pupil[];

    @ManyToMany((type) => Student, (student) => student.appointments, {
        eager: true,
    })
    @JoinTable({
        name: 'appointment_participant_student',
        joinColumn: { name: 'appointmentId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
    })
    participantsStudents: Student[];

    @ManyToMany((type) => Screener, (screener) => screener.appointments, {
        eager: true,
    })
    @JoinTable({
        name: 'appointment_participant_screener',
        joinColumn: { name: 'appointmentId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'screenerId', referencedColumnName: 'id' },
    })
    participantsScreeners: Screener[];
}
