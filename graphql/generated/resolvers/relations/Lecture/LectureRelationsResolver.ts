import * as TypeGraphQL from "type-graphql";
import { Course_attendance_log } from "../../../models/Course_attendance_log";
import { Lecture } from "../../../models/Lecture";
import { Student } from "../../../models/Student";
import { Subcourse } from "../../../models/Subcourse";
import { LectureCourse_attendance_logArgs } from "./args/LectureCourse_attendance_logArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Lecture)
export class LectureRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() lecture: Lecture, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).lecture.findUnique({
      where: {
        id: lecture.id,
      },
    }).student({});
  }

  @TypeGraphQL.FieldResolver(_type => Subcourse, {
    nullable: true
  })
  async subcourse(@TypeGraphQL.Root() lecture: Lecture, @TypeGraphQL.Ctx() ctx: any): Promise<Subcourse | null> {
    return getPrismaFromContext(ctx).lecture.findUnique({
      where: {
        id: lecture.id,
      },
    }).subcourse({});
  }

  @TypeGraphQL.FieldResolver(_type => [Course_attendance_log], {
    nullable: false
  })
  async course_attendance_log(@TypeGraphQL.Root() lecture: Lecture, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: LectureCourse_attendance_logArgs): Promise<Course_attendance_log[]> {
    return getPrismaFromContext(ctx).lecture.findUnique({
      where: {
        id: lecture.id,
      },
    }).course_attendance_log(args);
  }
}
