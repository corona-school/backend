import * as TypeGraphQL from "type-graphql";
import { Student } from "../../../models/Student";
import { Subcourse } from "../../../models/Subcourse";
import { Subcourse_instructors_student } from "../../../models/Subcourse_instructors_student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_instructors_student)
export class Subcourse_instructors_studentRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: false
  })
  async student(@TypeGraphQL.Root() subcourse_instructors_student: Subcourse_instructors_student, @TypeGraphQL.Ctx() ctx: any): Promise<Student> {
    return getPrismaFromContext(ctx).subcourse_instructors_student.findUnique({
      where: {
        subcourseId_studentId: {
          subcourseId: subcourse_instructors_student.subcourseId,
          studentId: subcourse_instructors_student.studentId,
        },
      },
    }).student({});
  }

  @TypeGraphQL.FieldResolver(_type => Subcourse, {
    nullable: false
  })
  async subcourse(@TypeGraphQL.Root() subcourse_instructors_student: Subcourse_instructors_student, @TypeGraphQL.Ctx() ctx: any): Promise<Subcourse> {
    return getPrismaFromContext(ctx).subcourse_instructors_student.findUnique({
      where: {
        subcourseId_studentId: {
          subcourseId: subcourse_instructors_student.subcourseId,
          studentId: subcourse_instructors_student.studentId,
        },
      },
    }).subcourse({});
  }
}
