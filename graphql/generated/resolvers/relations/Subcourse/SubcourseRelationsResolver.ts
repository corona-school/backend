import * as TypeGraphQL from "type-graphql";
import { Course } from "../../../models/Course";
import { Course_participation_certificate } from "../../../models/Course_participation_certificate";
import { Lecture } from "../../../models/Lecture";
import { Subcourse } from "../../../models/Subcourse";
import { Subcourse_instructors_student } from "../../../models/Subcourse_instructors_student";
import { Subcourse_participants_pupil } from "../../../models/Subcourse_participants_pupil";
import { Subcourse_waiting_list_pupil } from "../../../models/Subcourse_waiting_list_pupil";
import { SubcourseCourse_participation_certificateArgs } from "./args/SubcourseCourse_participation_certificateArgs";
import { SubcourseLectureArgs } from "./args/SubcourseLectureArgs";
import { SubcourseSubcourse_instructors_studentArgs } from "./args/SubcourseSubcourse_instructors_studentArgs";
import { SubcourseSubcourse_participants_pupilArgs } from "./args/SubcourseSubcourse_participants_pupilArgs";
import { SubcourseSubcourse_waiting_list_pupilArgs } from "./args/SubcourseSubcourse_waiting_list_pupilArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse)
export class SubcourseRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Course, {
    nullable: true
  })
  async course(@TypeGraphQL.Root() subcourse: Subcourse, @TypeGraphQL.Ctx() ctx: any): Promise<Course | null> {
    return getPrismaFromContext(ctx).subcourse.findUnique({
      where: {
        id: subcourse.id,
      },
    }).course({});
  }

  @TypeGraphQL.FieldResolver(_type => [Course_participation_certificate], {
    nullable: false
  })
  async course_participation_certificate(@TypeGraphQL.Root() subcourse: Subcourse, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: SubcourseCourse_participation_certificateArgs): Promise<Course_participation_certificate[]> {
    return getPrismaFromContext(ctx).subcourse.findUnique({
      where: {
        id: subcourse.id,
      },
    }).course_participation_certificate(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Lecture], {
    nullable: false
  })
  async lecture(@TypeGraphQL.Root() subcourse: Subcourse, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: SubcourseLectureArgs): Promise<Lecture[]> {
    return getPrismaFromContext(ctx).subcourse.findUnique({
      where: {
        id: subcourse.id,
      },
    }).lecture(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Subcourse_instructors_student], {
    nullable: false
  })
  async subcourse_instructors_student(@TypeGraphQL.Root() subcourse: Subcourse, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: SubcourseSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student[]> {
    return getPrismaFromContext(ctx).subcourse.findUnique({
      where: {
        id: subcourse.id,
      },
    }).subcourse_instructors_student(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Subcourse_participants_pupil], {
    nullable: false
  })
  async subcourse_participants_pupil(@TypeGraphQL.Root() subcourse: Subcourse, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: SubcourseSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil[]> {
    return getPrismaFromContext(ctx).subcourse.findUnique({
      where: {
        id: subcourse.id,
      },
    }).subcourse_participants_pupil(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Subcourse_waiting_list_pupil], {
    nullable: false
  })
  async subcourse_waiting_list_pupil(@TypeGraphQL.Root() subcourse: Subcourse, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: SubcourseSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil[]> {
    return getPrismaFromContext(ctx).subcourse.findUnique({
      where: {
        id: subcourse.id,
      },
    }).subcourse_waiting_list_pupil(args);
  }
}
