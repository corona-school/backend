import { AppointmentType } from '../entity/Lecture';
import { Field, InputType, Int } from 'type-graphql';
import { prisma } from '../prisma';
import { lecture_appointmenttype_enum } from '../../graphql/generated/enums/lecture_appointmenttype_enum';
import { ID } from 'type-graphql/dist/scalars/aliases';

@InputType()
export abstract class AppointmentCreateInput {
    @Field()
    title: string;
    @Field()
    description: string;
    @Field()
    start: Date;
    @Field()
    duration: number;
    @Field({ nullable: true })
    meetingLink?: string;
    @Field(() => ID, { nullable: true })
    subcourseId?: number;
    @Field(() => ID, { nullable: true })
    matchId?: number;
    @Field(() => [ID])
    organizers: number[]; // StudentIds
    @Field(() => [ID], { nullable: true })
    participants_pupil?: number[];
    @Field(() => [ID], { nullable: true })
    participants_student?: number[];
    @Field(() => [ID], { nullable: true })
    participants_screener?: number[];
    @Field(() => lecture_appointmenttype_enum)
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
                    data: appointment.participants_pupil?.map((id) => ({
                        studentId: id,
                    })) as [],
                },
            },
            appointment_participant_student: {
                createMany: {
                    data: appointment.participants_student?.map((id) => ({
                        studentId: id,
                    })) as [],
                },
            },
            appointment_participant_screener: {
                createMany: {
                    data: appointment.participants_screener?.map((id) => ({
                        studentId: id,
                    })) as [],
                },
            },
        },
    });
}
