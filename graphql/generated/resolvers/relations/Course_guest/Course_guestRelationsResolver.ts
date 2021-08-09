import * as TypeGraphQL from "type-graphql";
import { Course } from "../../../models/Course";
import { Course_guest } from "../../../models/Course_guest";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_guest)
export class Course_guestRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Course, {
    nullable: true
  })
  async course(@TypeGraphQL.Root() course_guest: Course_guest, @TypeGraphQL.Ctx() ctx: any): Promise<Course | null> {
    return getPrismaFromContext(ctx).course_guest.findUnique({
      where: {
        id: course_guest.id,
      },
    }).course({});
  }

  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() course_guest: Course_guest, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).course_guest.findUnique({
      where: {
        id: course_guest.id,
      },
    }).student({});
  }
}
