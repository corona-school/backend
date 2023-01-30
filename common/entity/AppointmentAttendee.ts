import { Column, Index, PrimaryColumn } from 'typeorm';

export enum AttendanceStatus {
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
}

export abstract class AppointmentAttendee {
    @PrimaryColumn()
    appointmentId: number;

    @Index({ unique: false })
    @Column({ nullable: false, type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.ACCEPTED })
    status: AttendanceStatus;
}
