import * as TypeGraphQL from "type-graphql";
import { Course_attendance_log } from "../../../models/Course_attendance_log";
import { Lecture } from "../../../models/Lecture";
import { Pupil } from "../../../models/Pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_attendance_log)
export class Course_attendance_logRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Lecture, {
    nullable: true
  })
  async lecture(@TypeGraphQL.Root() course_attendance_log: Course_attendance_log, @TypeGraphQL.Ctx() ctx: any): Promise<Lecture | null> {
    return getPrismaFromContext(ctx).course_attendance_log.findUnique({
      where: {
        id: course_attendance_log.id,
      },
    }).lecture({});
  }

  @TypeGraphQL.FieldResolver(_type => Pupil, {
    nullable: true
  })
  async pupil(@TypeGraphQL.Root() course_attendance_log: Course_attendance_log, @TypeGraphQL.Ctx() ctx: any): Promise<Pupil | null> {
    return getPrismaFromContext(ctx).course_attendance_log.findUnique({
      where: {
        id: course_attendance_log.id,
      },
    }).pupil({});
  }
}
