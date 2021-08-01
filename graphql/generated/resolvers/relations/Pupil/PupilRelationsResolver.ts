import * as TypeGraphQL from "type-graphql";
import { Course_attendance_log } from "../../../models/Course_attendance_log";
import { Course_participation_certificate } from "../../../models/Course_participation_certificate";
import { Match } from "../../../models/Match";
import { Participation_certificate } from "../../../models/Participation_certificate";
import { Project_match } from "../../../models/Project_match";
import { Pupil } from "../../../models/Pupil";
import { Pupil_tutoring_interest_confirmation_request } from "../../../models/Pupil_tutoring_interest_confirmation_request";
import { School } from "../../../models/School";
import { Subcourse_participants_pupil } from "../../../models/Subcourse_participants_pupil";
import { Subcourse_waiting_list_pupil } from "../../../models/Subcourse_waiting_list_pupil";
import { PupilCourse_attendance_logArgs } from "./args/PupilCourse_attendance_logArgs";
import { PupilCourse_participation_certificateArgs } from "./args/PupilCourse_participation_certificateArgs";
import { PupilMatchArgs } from "./args/PupilMatchArgs";
import { PupilParticipation_certificateArgs } from "./args/PupilParticipation_certificateArgs";
import { PupilProject_matchArgs } from "./args/PupilProject_matchArgs";
import { PupilSubcourse_participants_pupilArgs } from "./args/PupilSubcourse_participants_pupilArgs";
import { PupilSubcourse_waiting_list_pupilArgs } from "./args/PupilSubcourse_waiting_list_pupilArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Pupil)
export class PupilRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => School, {
    nullable: true
  })
  async school(@TypeGraphQL.Root() pupil: Pupil, @TypeGraphQL.Ctx() ctx: any): Promise<School | null> {
    return getPrismaFromContext(ctx).pupil.findUnique({
      where: {
        id: pupil.id,
      },
    }).school({});
  }

  @TypeGraphQL.FieldResolver(_type => [Course_attendance_log], {
    nullable: false
  })
  async course_attendance_log(@TypeGraphQL.Root() pupil: Pupil, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: PupilCourse_attendance_logArgs): Promise<Course_attendance_log[]> {
    return getPrismaFromContext(ctx).pupil.findUnique({
      where: {
        id: pupil.id,
      },
    }).course_attendance_log(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Course_participation_certificate], {
    nullable: false
  })
  async course_participation_certificate(@TypeGraphQL.Root() pupil: Pupil, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: PupilCourse_participation_certificateArgs): Promise<Course_participation_certificate[]> {
    return getPrismaFromContext(ctx).pupil.findUnique({
      where: {
        id: pupil.id,
      },
    }).course_participation_certificate(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Match], {
    nullable: false
  })
  async match(@TypeGraphQL.Root() pupil: Pupil, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: PupilMatchArgs): Promise<Match[]> {
    return getPrismaFromContext(ctx).pupil.findUnique({
      where: {
        id: pupil.id,
      },
    }).match(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Participation_certificate], {
    nullable: false
  })
  async participation_certificate(@TypeGraphQL.Root() pupil: Pupil, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: PupilParticipation_certificateArgs): Promise<Participation_certificate[]> {
    return getPrismaFromContext(ctx).pupil.findUnique({
      where: {
        id: pupil.id,
      },
    }).participation_certificate(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Project_match], {
    nullable: false
  })
  async project_match(@TypeGraphQL.Root() pupil: Pupil, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: PupilProject_matchArgs): Promise<Project_match[]> {
    return getPrismaFromContext(ctx).pupil.findUnique({
      where: {
        id: pupil.id,
      },
    }).project_match(args);
  }

  @TypeGraphQL.FieldResolver(_type => Pupil_tutoring_interest_confirmation_request, {
    nullable: true
  })
  async pupil_tutoring_interest_confirmation_request(@TypeGraphQL.Root() pupil: Pupil, @TypeGraphQL.Ctx() ctx: any): Promise<Pupil_tutoring_interest_confirmation_request | null> {
    return getPrismaFromContext(ctx).pupil.findUnique({
      where: {
        id: pupil.id,
      },
    }).pupil_tutoring_interest_confirmation_request({});
  }

  @TypeGraphQL.FieldResolver(_type => [Subcourse_participants_pupil], {
    nullable: false
  })
  async subcourse_participants_pupil(@TypeGraphQL.Root() pupil: Pupil, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: PupilSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil[]> {
    return getPrismaFromContext(ctx).pupil.findUnique({
      where: {
        id: pupil.id,
      },
    }).subcourse_participants_pupil(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Subcourse_waiting_list_pupil], {
    nullable: false
  })
  async subcourse_waiting_list_pupil(@TypeGraphQL.Root() pupil: Pupil, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: PupilSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil[]> {
    return getPrismaFromContext(ctx).pupil.findUnique({
      where: {
        id: pupil.id,
      },
    }).subcourse_waiting_list_pupil(args);
  }
}
