import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Subcourse } from './Subcourse';
import { CourseAttendanceLog } from './CourseAttendanceLog';
import { OneToMany } from 'typeorm/index';
import { Match } from './Match';
import { Pupil } from './Pupil';
import { Screener } from './Screener';

export enum AppointmentType {
    GROUP = 'group',
    ONE_ON_ONE = '1on1',
    OTHER_INTERNAL = 'other-internal',
    LEGACY_LECTURE = 'legacy-lecture',
}

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
        enum: AppointmentType,
        nullable: false,
        default: AppointmentType.LEGACY_LECTURE,
    })
    appointmentType: AppointmentType;

    @Column({
        nullable: true,
    })
    meetingLink: string;

    @Column({
        nullable: true,
    })
    isCanceled: boolean;

    /**
     * already present in Lecture
     @ManyToOne((type) => Subcourse, null, {
        eager: true,
        nullable: true,
    })
     @JoinColumn()
     subcourse: Subcourse;
     */

    @ManyToOne((type) => Match, null, {
        eager: true,
        nullable: true,
    })
    @JoinColumn()
    match: Match;

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
