import { Field, InputType, Int } from 'type-graphql';
import { prisma } from '../prisma';
import { lecture_appointmenttype_enum } from '@prisma/client';
import { PrerequisiteError } from '../util/error';

type StudentId = number;

@InputType()
export class AppointmentInputText {
    @Field()
    title?: string;
    @Field()
    description?: string;
}
@InputType()
export abstract class AppointmentCreateInputBase extends AppointmentInputText {
    @Field()
    start: Date;
    @Field()
    duration: number;
    @Field({ nullable: true })
    meetingLink?: string;
}

@InputType()
export abstract class AppointmentCreateMatchInput extends AppointmentCreateInputBase {
    @Field(() => Int, { nullable: false })
    matchId: number;
}

@InputType()
export abstract class AppointmentCreateGroupInput extends AppointmentCreateInputBase {
    @Field(() => Int, { nullable: false })
    subcourseId: number;
}

@InputType()
export abstract class AppointmentCreateInputFull extends AppointmentCreateInputBase {
    @Field(() => Int, { nullable: true })
    subcourseId?: number;
    @Field(() => Int, { nullable: true })
    matchId?: number;
    @Field(() => [Int])
    organizers: StudentId[];
    @Field(() => [Int], { nullable: true })
    participants_pupil?: number[];
    @Field(() => [Int], { nullable: true })
    participants_student?: number[];
    @Field(() => [Int], { nullable: true })
    participants_screener?: number[];
    @Field(() => lecture_appointmenttype_enum)
    appointmentType: lecture_appointmenttype_enum;
}

const createSingleAppointment = async (appointment: AppointmentCreateInputFull) => {
    return await prisma.lecture.create({
        data: {
            title: appointment.title,
            description: appointment.description,
            start: appointment.start,
            duration: appointment.duration,
            meetingLink: appointment.meetingLink,
            subcourseId: appointment.subcourseId,
            matchId: appointment.matchId,
            appointmentType: appointment.appointmentType,
            appointment_organizer: appointment.organizers?.length
                ? {
                      createMany: {
                          data: appointment.organizers.map((id) => ({
                              studentId: id,
                          })),
                      },
                  }
                : undefined,
            appointment_participant_pupil: appointment.participants_pupil?.length
                ? {
                      createMany: {
                          data: appointment.participants_pupil.map((id) => ({
                              pupilId: id,
                          })),
                      },
                  }
                : undefined,
            appointment_participant_student: appointment.participants_student?.length
                ? {
                      createMany: {
                          data: appointment.participants_student?.map((id) => ({
                              studentId: id,
                          })),
                      },
                  }
                : undefined,
            appointment_participant_screener: appointment.participants_screener?.length
                ? {
                      createMany: {
                          data: appointment.participants_screener?.map((id) => ({
                              screenerId: id,
                          })),
                      },
                  }
                : undefined,
        },
    });
};

export async function createAppointments(appointments: AppointmentCreateInputFull[]) {
    validate(appointments);

    await Promise.all(appointments.map(createSingleAppointment));
}

const validate = (appointments: AppointmentCreateInputFull[]) => {
    if (!appointments.every((appointment) => !!appointment.organizers.length)) {
        throw new PrerequisiteError(`Appointments must have at least one organizer`);
    }
};
