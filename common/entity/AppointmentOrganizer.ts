import { Entity, PrimaryColumn } from 'typeorm';
import { AppointmentAttendee } from './AppointmentAttendee';

@Entity()
export class AppointmentOrganizer extends AppointmentAttendee {
    @PrimaryColumn()
    studentId: number;
}
