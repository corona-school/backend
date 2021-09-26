import * as TypeGraphQL from "type-graphql";
import { Course_participation_certificate } from "../../../models/Course_participation_certificate";
import { Pupil } from "../../../models/Pupil";
import { Student } from "../../../models/Student";
import { Subcourse } from "../../../models/Subcourse";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_participation_certificate)
export class Course_participation_certificateRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() course_participation_certificate: Course_participation_certificate, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).course_participation_certificate.findUnique({
      where: {
        id: course_participation_certificate.id,
      },
    }).student({});
  }

  @TypeGraphQL.FieldResolver(_type => Pupil, {
    nullable: true
  })
  async pupil(@TypeGraphQL.Root() course_participation_certificate: Course_participation_certificate, @TypeGraphQL.Ctx() ctx: any): Promise<Pupil | null> {
    return getPrismaFromContext(ctx).course_participation_certificate.findUnique({
      where: {
        id: course_participation_certificate.id,
      },
    }).pupil({});
  }

  @TypeGraphQL.FieldResolver(_type => Subcourse, {
    nullable: true
  })
  async subcourse(@TypeGraphQL.Root() course_participation_certificate: Course_participation_certificate, @TypeGraphQL.Ctx() ctx: any): Promise<Subcourse | null> {
    return getPrismaFromContext(ctx).course_participation_certificate.findUnique({
      where: {
        id: course_participation_certificate.id,
      },
    }).subcourse({});
  }
}
