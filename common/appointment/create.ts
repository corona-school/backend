import { AppointmentType } from '../entity/Lecture';
import { InputType } from 'type-graphql';
import { prisma } from '../prisma';

@InputType()
export abstract class AppointmentCreateInput {
    title: string;
    description: string;
    start: Date;
    duration: number;
    meetingLink?: string;
    subcourseId?: number;
    matchId?: number;
    organizers?: string[]; // StudentIds
    participants?: string[]; // Student-, Pupil- & ScreenerIds
    appointmentType: AppointmentType;
}
export async function createAppointment(appointment: AppointmentCreateInput) {
    await prisma.lecture.create({
        data: {
            title: appointment.title,
            duration: appointment.duration,
        },
    });
}
