import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Subcourse } from './Subcourse';
import { CourseAttendanceLog } from './CourseAttendanceLog';
import { OneToMany } from 'typeorm/index';
import { Match } from './Match';
import { User } from '../user';

enum AppointmentType {
    GROUP = 'group',
    MATCH = 'match',
    INTERNAL = 'internal',
    LEGACY = 'legacy',
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

    @ManyToOne((type) => Subcourse, (subcourse) => subcourse.lectures)
    @JoinColumn()
    subcourse: Subcourse;

    @Column('timestamp')
    start: Date;

    @Column()
    duration: number;

    @OneToMany((type) => CourseAttendanceLog, (courseAttendanceLog) => courseAttendanceLog.lecture)
    courseAttendanceLog: CourseAttendanceLog[];

    //* Appointment

    @Column({ type: 'text', nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: AppointmentType,
        nullable: false,
        default: AppointmentType.LEGACY,
    })
    appointmentType: AppointmentType;

    @Column({
        nullable: true,
        default: false,
    })
    isCanceled: boolean;

    @ManyToOne((type) => Match, (match) => match.appointments, {
        eager: true,
        nullable: true,
    })
    @JoinColumn()
    match: Match;

    @Column({
        type: 'text',
        default: [],
        array: true,
    })
    organizerIds: User['userID'][];

    @Column({
        type: 'text',
        default: [],
        array: true,
    })
    participantIds: User['userID'][];

    @Column({
        type: 'text',
        default: [],
        array: true,
    })
    declinedBy: User['userID'][];

    @Column({ default: null, nullable: true })
    zoomMeetingId: string;

    @Column({ nullable: true, type: 'json' })
    zoomMeetingReport: any;
}
