import { AppointmentType } from '../entity/Lecture';
import { Field, InputType, Int } from 'type-graphql';
import { prisma } from '../prisma';
import { lecture_appointmenttype_enum } from '../../graphql/generated/enums/lecture_appointmenttype_enum';
import { PrerequisiteError } from '../util/error';

@InputType()
export abstract class AppointmentCreateInputBase {
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
    organizers: number[]; // StudentIds
    @Field(() => [Int], { nullable: true })
    participants_pupil?: number[];
    @Field(() => [Int], { nullable: true })
    participants_student?: number[];
    @Field(() => [Int], { nullable: true })
    participants_screener?: number[];
    @Field(() => lecture_appointmenttype_enum)
    appointmentType: AppointmentType;
}

export async function createAppointment(appointment: AppointmentCreateInputFull) {
    if (!appointment?.organizers) {
        throw new PrerequisiteError(`Appointment must have at least one organizer`);
    }
    const lecture = await prisma.lecture.create({
        data: {
            title: appointment.title,
            description: appointment.description,
            start: appointment.start,
            duration: appointment.duration,
            meetingLink: appointment.meetingLink,
            subcourseId: appointment.subcourseId,
            matchId: appointment.matchId,
            appointmentType: appointment.appointmentType as unknown as lecture_appointmenttype_enum,
            appointment_organizer: appointment.organizers?.length
                ? {
                      createMany: {
                          data: appointment.organizers.map((id) => ({
                              studentId: id,
                          })) as [],
                      },
                  }
                : undefined,
            appointment_participant_pupil: appointment.participants_pupil?.length
                ? {
                      createMany: {
                          data: appointment.participants_pupil.map((id) => ({
                              pupilId: id,
                          })) as [],
                      },
                  }
                : undefined,
            appointment_participant_student: appointment.participants_student?.length
                ? {
                      createMany: {
                          data: appointment.participants_student?.map((id) => ({
                              studentId: id,
                          })) as [],
                      },
                  }
                : undefined,
            appointment_participant_screener: appointment.participants_screener?.length
                ? {
                      createMany: {
                          data: appointment.participants_screener?.map((id) => ({
                              screenerId: id,
                          })) as [],
                      },
                  }
                : undefined,
        },
    });

    if (lecture.id) {
        return true;
    }
    return false;
}
