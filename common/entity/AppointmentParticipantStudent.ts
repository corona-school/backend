import { Entity, PrimaryColumn } from 'typeorm';
import { AppointmentAttendee } from './AppointmentAttendee';

@Entity()
export class AppointmentParticipantStudent extends AppointmentAttendee {
    @PrimaryColumn()
    studentId: number;
}
