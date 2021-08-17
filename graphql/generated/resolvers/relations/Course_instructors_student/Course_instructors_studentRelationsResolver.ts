import * as TypeGraphQL from "type-graphql";
import { Course } from "../../../models/Course";
import { Course_instructors_student } from "../../../models/Course_instructors_student";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_instructors_student)
export class Course_instructors_studentRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Course, {
    nullable: false
  })
  async course(@TypeGraphQL.Root() course_instructors_student: Course_instructors_student, @TypeGraphQL.Ctx() ctx: any): Promise<Course> {
    return getPrismaFromContext(ctx).course_instructors_student.findUnique({
      where: {
        courseId_studentId: {
          courseId: course_instructors_student.courseId,
          studentId: course_instructors_student.studentId,
        },
      },
    }).course({});
  }

  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: false
  })
  async student(@TypeGraphQL.Root() course_instructors_student: Course_instructors_student, @TypeGraphQL.Ctx() ctx: any): Promise<Student> {
    return getPrismaFromContext(ctx).course_instructors_student.findUnique({
      where: {
        courseId_studentId: {
          courseId: course_instructors_student.courseId,
          studentId: course_instructors_student.studentId,
        },
      },
    }).student({});
  }
}
