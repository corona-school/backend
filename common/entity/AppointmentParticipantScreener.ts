import { Entity, PrimaryColumn } from 'typeorm';
import { AppointmentAttendee } from './AppointmentAttendee';

@Entity()
export class AppointmentParticipantScreener extends AppointmentAttendee {
    @PrimaryColumn()
    screenerId: number;
}
