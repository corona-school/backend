import { Column, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';
import { Pupil } from './Pupil';
import { Match } from './Match';
import { Screener } from './Screener';

export enum AppointmentType {
    GROUP = 'group',
    ONE_ON_ONE = '1on1',
    OTHER_INTERNAL = 'other-internal',
    LEGACY_LECTURE = 'legacy-lecture',
}

export abstract class AbstractAppointment {
    @PrimaryGeneratedColumn()
    id: number;

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
