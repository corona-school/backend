import { Role } from "../authorizations";
import { AuthorizedDeferred } from "../authorizations";
import { Arg, Authorized, Ctx, Field, InputType, Int, Mutation, Resolver } from "type-graphql";
import { Me } from "./fields";
import { Subject } from "../types/subject";
import { GraphQLContext } from "../context";
import { getSessionPupil, getSessionStudent, getSessionUser } from "../authentication";
import { prisma } from "../../common/prisma";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { ProjectField } from "../../common/jufo/projectFields";
import { pupil_projectfields_enum } from ".prisma/client";
import { project_field_with_grade_restriction_projectfield_enum } from "@prisma/client";

@InputType()
class ProjectFieldWithGradeInput {

    @Field(type => ProjectField)
    name: ProjectField;
    @Field(type => Int, { nullable: true })
    min?: number;
    @Field(type => Int, { nullable: true })
    max?: number;
};

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

        // TODO Student activation

        throw new Error(`This mutation is currently not supported for this user type`);
    }

}