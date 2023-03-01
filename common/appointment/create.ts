import { Field, InputType, Int } from 'type-graphql';
import { prisma } from '../prisma';
import { lecture_appointmenttype_enum } from '@prisma/client';
import { PrerequisiteError } from '../util/error';
import assert from 'assert';

type StudentId = number;

@InputType()
export class AppointmentInputText {
    @Field({ nullable: true })
    title?: string;
    @Field({ nullable: true })
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
    @Field(() => Int)
    matchId: number;
    @Field(() => lecture_appointmenttype_enum)
    appointmentType: 'match';
}

@InputType()
export abstract class AppointmentCreateGroupInput extends AppointmentCreateInputBase {
    @Field(() => Int, { nullable: false })
    subcourseId: number;
    appointmentType: 'group';
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

export const createMatchAppointment = async (appointmentToBeCreated: AppointmentCreateMatchInput) => {
    const match = await prisma.match.findUniqueOrThrow({ where: { id: appointmentToBeCreated.matchId } });
    return await prisma.lecture.create({
        data: {
            title: appointmentToBeCreated.title,
            description: appointmentToBeCreated.description,
            start: appointmentToBeCreated.start,
            duration: appointmentToBeCreated.duration,
            meetingLink: appointmentToBeCreated.meetingLink,
            matchId: appointmentToBeCreated.matchId,
            appointmentType: 'match',
            appointment_organizer: {
                createMany: {
                    data: [{ studentId: match.studentId }],
                },
            },
            appointment_participant_pupil: {
                createMany: {
                    data: [{ pupilId: match.pupilId }],
                },
            },
        },
    });
};

export const createMatchAppointments = async (matchId: number, appointmentsToBeCreated: AppointmentCreateMatchInput[]) => {
    const match = await prisma.match.findUniqueOrThrow({ where: { id: matchId } });
    return await Promise.all(
        appointmentsToBeCreated.map(
            async (appointmentToBeCreated) =>
                await prisma.lecture.create({
                    data: {
                        title: appointmentToBeCreated.title,
                        description: appointmentToBeCreated.description,
                        start: appointmentToBeCreated.start,
                        duration: appointmentToBeCreated.duration,
                        meetingLink: appointmentToBeCreated.meetingLink,
                        matchId: appointmentToBeCreated.matchId,
                        appointmentType: 'match',
                        appointment_organizer: {
                            createMany: {
                                data: [{ studentId: match.studentId }],
                            },
                        },
                        appointment_participant_pupil: {
                            createMany: {
                                data: [{ pupilId: match.pupilId }],
                            },
                        },
                    },
                })
        )
    );
};

export const createGroupAppointment = async (appointmentToBeCreated: AppointmentCreateGroupInput) => {
    const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: appointmentToBeCreated.subcourseId } });
    const instructors = await prisma.subcourse_instructors_student.findMany({ where: { subcourseId: appointmentToBeCreated.subcourseId } });
    assert(
        instructors.length > 0,
        `No instructors found for subcourse ${appointmentToBeCreated.subcourseId} there must be at least one organizer for an appointment`
    );
    return await prisma.lecture.create({
        data: {
            title: appointmentToBeCreated.title,
            description: appointmentToBeCreated.description,
            start: appointmentToBeCreated.start,
            duration: appointmentToBeCreated.duration,
            meetingLink: appointmentToBeCreated.meetingLink,
            subcourseId: appointmentToBeCreated.subcourseId,
            appointmentType: 'group',
            appointment_organizer: {
                createMany: {
                    data: instructors.map((inst) => ({ studentId: inst.studentId })),
                },
            },
            appointment_participant_pupil: {
                createMany: {
                    data: participants.map((p) => ({ pupilId: p.pupilId })),
                },
            },
        },
    });
};

export const createGroupAppointments = async (subcourseId: number, appointmentsToBeCreated: AppointmentCreateGroupInput[]) => {
    const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId } });
    const instructors = await prisma.subcourse_instructors_student.findMany({ where: { subcourseId } });
    assert(instructors.length > 0, `No instructors found for subcourse ${subcourseId} there must be at least one organizer for an appointment`);
    return await Promise.all(
        appointmentsToBeCreated.map(
            async (appointmentToBeCreated) =>
                await prisma.lecture.create({
                    data: {
                        title: appointmentToBeCreated.title,
                        description: appointmentToBeCreated.description,
                        start: appointmentToBeCreated.start,
                        duration: appointmentToBeCreated.duration,
                        meetingLink: appointmentToBeCreated.meetingLink,
                        subcourseId: appointmentToBeCreated.subcourseId,
                        appointmentType: 'group',
                        appointment_organizer: {
                            createMany: {
                                data: instructors.map((inst) => ({ studentId: inst.studentId })),
                            },
                        },
                        appointment_participant_pupil: {
                            createMany: {
                                data: participants.map((p) => ({ pupilId: p.pupilId })),
                            },
                        },
                    },
                })
        )
    );
};

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
