import { Entity, PrimaryColumn } from 'typeorm';
import { AppointmentAttendee } from './AppointmentAttendee';

@Entity()
export class AppointmentParticipantPupil extends AppointmentAttendee {
    @PrimaryColumn()
    pupilId: number;
}
