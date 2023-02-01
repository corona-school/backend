import { AppointmentType } from '../entity/Lecture';
import { InputType } from 'type-graphql';
import { prisma } from '../prisma';
import { lecture_appointmenttype_enum } from '../../graphql/generated/enums/lecture_appointmenttype_enum';

@InputType()
export abstract class AppointmentCreateInput {
    title: string;
    description: string;
    start: Date;
    duration: number;
    meetingLink?: string;
    subcourseId?: number;
    matchId?: number;
    organizers?: number[]; // StudentIds
    participants_pupil?: number[];
    participants_student?: number[];
    participants_screener?: number[];
    appointmentType: AppointmentType;
}
export async function createAppointment(appointment: AppointmentCreateInput) {
    await prisma.lecture.create({
        data: {
            title: appointment.title,
            description: appointment.description,
            start: appointment.start,
            duration: appointment.duration,
            meetingLink: appointment.meetingLink,
            subcourseId: appointment.subcourseId,
            matchId: appointment.matchId,
            appointmentType: appointment.appointmentType as unknown as lecture_appointmenttype_enum,
            appointment_organizer: {
                createMany: {
                    data: appointment.organizers.map((id) => ({
                        studentId: id,
                    })) as [],
                },
            },
            appointment_participant_pupil: {
                createMany: {
                    data: appointment.participants_pupil.map((id) => ({
                        studentId: id,
                    })) as [],
                },
            },
            appointment_participant_student: {
                createMany: {
                    data: appointment.participants_student.map((id) => ({
                        studentId: id,
                    })) as [],
                },
            },
            appointment_participant_screener: {
                createMany: {
                    data: appointment.participants_screener.map((id) => ({
                        studentId: id,
                    })) as [],
                },
            },
        },
    });
}
