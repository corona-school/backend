import { Role } from "../authorizations";
import { Arg, Authorized, Ctx, Field, InputType, Int, Mutation, Resolver } from "type-graphql";
import { Me } from "./fields";
import { Subject } from "../types/subject";
import { GraphQLContext } from "../context";
import { getSessionPupil, getSessionStudent, getSessionUser } from "../authentication";
import { prisma } from "../../common/prisma";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { ProjectField } from "../../common/jufo/projectFields";
import { pupil_projectfields_enum, student_languages_enum, student_state_enum } from ".prisma/client";
import { project_field_with_grade_restriction_projectfield_enum } from "@prisma/client";
import { TeacherModule } from "../../common/entity/Student";
import { MaxLength } from "class-validator";
import { sendFirstInstructorScreeningInvitationMail } from "../../common/mails/screening";
import { Language } from "../../common/daz/language";
import * as Notification from "../../common/notification";
import { DEFAULT_SCREENER_NUMBER_ID } from "../../common/entity/Screener";
import { TuteeJufoParticipationIndication, TutorJufoParticipationIndication } from "../../common/jufo/participationIndication";

@InputType()
class ProjectFieldWithGradeInput {

    @Field(type => ProjectField)
    name: ProjectField;
    @Field(type => Int, { nullable: true })
    min?: number;
    @Field(type => Int, { nullable: true })
    max?: number;
}

@InputType()
class PupilUpdateInput {
    @Field(type => Int, { nullable: true })
    gradeAsInt?: number;

    @Field(type => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field(type => [ProjectField], { nullable: true })
    projectFields: ProjectField[];
}

@InputType()
class StudentUpdateInput {
    @Field(type => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field(type => [ProjectFieldWithGradeInput], { nullable: true })
    projectFields: ProjectFieldWithGradeInput[];
}


@InputType()
class MeUpdateInput {
  @Field(type => String, { nullable: true })
  firstname?: string;

  @Field(type => String, { nullable: true })
  lastname?: string;

  @Field(type => PupilUpdateInput, { nullable: true })
  pupil?: PupilUpdateInput;

  @Field(type => StudentUpdateInput, { nullable: true })
  student?: StudentUpdateInput;
}

@InputType()
class BecomeInstructorInput {
    @Field(type => String, { nullable: true })
    university: string;

    @Field(type => String, { nullable: true })
    state: string;

    @Field(type => TeacherModule, { nullable: true })
    teacherModule: TeacherModule;

    @Field(type => Int, { nullable: true })
    moduleHours: number;

    @Field(type => String)
    @MaxLength(3000)
    message: string;
}

@InputType()
class BecomeTutorInput {
    @Field(type => [Subject])
    subjects: Subject[];

    @Field(type => [Language])
    languages: Language[];

    @Field(type => Boolean)
    supportsInDaZ: boolean;
}

@InputType()
class BecomeProjectCoachInput {
    @Field(type => [ProjectFieldWithGradeInput])
    projectFields: ProjectFieldWithGradeInput[];

    @Field(type => TutorJufoParticipationIndication)
    wasJufoParticipant: TutorJufoParticipationIndication;

    @Field(type => Boolean)
    isUniversityStudent: boolean;


    @Field(type => Boolean)
    hasJufoCertificate: boolean;

    @Field(type => String)
    jufoPastParticipationInfo: string;
}

@InputType()
class BecomeProjectCoacheeInput {
    @Field(type => [ProjectField])
    projectFields: ProjectField[];

    @Field(type => Boolean)
    isJufoParticipant: TuteeJufoParticipationIndication;

    @Field(type => Int)
    projectMemberCount: number;
}

@Resolver(of => Me)
export class MutateMeResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.USER)
    async meUpdate(@Ctx() context: GraphQLContext, @Arg("update") update: MeUpdateInput) {
        const user = getSessionUser(context);

        const { firstname, lastname, pupil, student } = update;

        if (user.pupilId) {
            const prevPupil = await getSessionPupil(context);

            if (student) {
                throw new Error(`Tried to update student data on a pupil`);
            }

            const { subjects, gradeAsInt, projectFields } = pupil;

            if (projectFields && !prevPupil.isProjectCoachee) {
                throw new Error(`Only project coachees can set the project fields`);
            }

            await prisma.pupil.update({
                data: {
                    firstname,
                    lastname,
                    // TODO: Store numbers as numbers maybe ...
                    grade: `${gradeAsInt}. Klasse`,
                    subjects: JSON.stringify(subjects),
                    projectFields: projectFields as pupil_projectfields_enum[]
                },
                where: { id: user.pupilId }
            });

            return true;
        }

        if (user.studentId) {
            const prevStudent = await getSessionStudent(context);

            if (pupil) {
                throw new Error(`Tried to update pupil data on student`);
            }

            const { projectFields, subjects } = student;

            if (projectFields && !prevStudent.isProjectCoach) {
                throw new Error(`Only project coaches can set the project fields`);
            }

            if (projectFields) {
                await prisma.$transaction(async prisma => {
                    await prisma.project_field_with_grade_restriction.deleteMany({ where: { studentId: user.studentId}});
                    await prisma.project_field_with_grade_restriction.createMany({ data: projectFields.map(it => ({ projectField: it.name as project_field_with_grade_restriction_projectfield_enum, min: it.min, max: it.max, studentId: user.studentId })) });
                });
            }

            await prisma.student.update({
                data: {
                    firstname,
                    lastname,
                    subjects: JSON.stringify(subjects)
                },
                where: { id: user.studentId }
            });

            return true;
        }
        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.USER)
    async meDeactivate(@Ctx() context: GraphQLContext) {
        const user = getSessionUser(context);

        if (user.pupilId) {
            const pupil = await getSessionPupil(context);
            await deactivatePupil(pupil);

            return true;
        }

        // TODO: Student deactivation

        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.USER)
    async meActivate(@Ctx() context: GraphQLContext) {
        const user = getSessionUser(context);

        if (user.pupilId) {
            const pupil = await getSessionPupil(context);
            await activatePupil(pupil);
            return true;
        }

        // TODO: Student activation

        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT)
    async meBecomeInstructor(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeInstructorInput) {
        const student = await getSessionStudent(context);
        if (student.isInstructor) {
            throw new Error(`Student is already instructor`);
        }

        const { university, message, state, teacherModule, moduleHours } = data;

        await prisma.student.update({
            data: {
                isInstructor: true,
                state: state as student_state_enum,
                university,
                msg: message,
                module: teacherModule,
                moduleHours,
                lastSentInstructorScreeningInvitationDate: new Date()
            },
            where: { id: student.id }
        });

        await sendFirstInstructorScreeningInvitationMail(student);


        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT)
    async meBecomeTutor(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeTutorInput) {
        const student = await getSessionStudent(context);

        if (student.isStudent) {
            throw new Error(`Student is already tutor`);
        }

        const { languages, subjects, supportsInDaZ } = data;

        await prisma.student.update({
            data: {
                isStudent: true,
                openMatchRequestCount: 1,
                subjects: JSON.stringify(subjects),
                languages: languages as student_languages_enum[],
                supportsInDaZ
            },
            where: { id: student.id }
        });

        const isScreenedCoach = await prisma.project_coaching_screening.count({
            where: { studentId: student.id, success: true }
        }) > 0;

        if (isScreenedCoach) {
            await prisma.screening.create({
                data: {
                    success: true,
                    screenerId: DEFAULT_SCREENER_NUMBER_ID,
                    comment: `[AUTOMATICALLY GENERATED SECONDARY SCREENING DUE TO VALID PROJECT COACHING SCREENING]`,
                    knowsCoronaSchoolFrom: ""
                }
            });

            await Notification.actionTaken(student, "tutor_screening_success", {});
        }

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT)
    async meBecomeProjectCoach(@Ctx() context: GraphQLContext, data: BecomeProjectCoachInput) {
        const student = await getSessionStudent(context);

        if (student.isProjectCoach) {
            throw new Error(`Student is already a coach`);
        }

        const { hasJufoCertificate, isUniversityStudent, jufoPastParticipationInfo, projectFields, wasJufoParticipant } = data;

        if (projectFields) {
            await prisma.$transaction(async prisma => {
                await prisma.project_field_with_grade_restriction.deleteMany({ where: { studentId: student.id }});
                await prisma.project_field_with_grade_restriction.createMany({ data: projectFields.map(it => ({ projectField: it.name as project_field_with_grade_restriction_projectfield_enum, min: it.min, max: it.max, studentId: user.studentId })) });
            });
        }

        await prisma.student.update({
            data: {
                isProjectCoach: true,
                wasJufoParticipant,
                isUniversityStudent,
                hasJufoCertificate,
                jufoPastParticipationInfo
            },
            where: { id: student.id }
        });

        /* TODO:
        if (!student.isStudent && !(student.isUniversityStudent === false && student.wasJufoParticipant === TutorJufoParticipationIndication.YES && student.hasJufoCertificate === false)) {
            if (student.isUniversityStudent) {
                //send usual tutor screening invitation
                await sendFirstScreeningInvitationToTutor(entityManager, student);
            } else if (student.wasJufoParticipant === TutorJufoParticipationIndication.YES && student.hasJufoCertificate === true) {
                //invite to jufo specific screening
                await sendFirstScreeningInvitationToProjectCoachingJufoAlumni(entityManager, student);
            }
        } */

        return true;
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.PUPIL)
    async meBecomeProjectCoachee(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeProjectCoacheeInput) {
        const pupil = await getSessionPupil(context);

        if (pupil.isProjectCoachee) {
            throw new Error(`Pupil is already project coachee`);
        }

        const { isJufoParticipant, projectFields, projectMemberCount } = data;

        await prisma.pupil.update({
            data: {
                isProjectCoachee: true,
                isJufoParticipant,
                projectFields: projectFields as pupil_projectfields_enum[],
                projectMemberCount
            },
            where: { id: pupil.id }
        });

        return true;
    }
}