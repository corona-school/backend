import * as TypeGraphQL from "type-graphql";
import { Certificate_of_conduct } from "../../../models/Certificate_of_conduct";
import { Course } from "../../../models/Course";
import { Course_guest } from "../../../models/Course_guest";
import { Course_instructors_student } from "../../../models/Course_instructors_student";
import { Course_participation_certificate } from "../../../models/Course_participation_certificate";
import { Expert_data } from "../../../models/Expert_data";
import { Instructor_screening } from "../../../models/Instructor_screening";
import { Jufo_verification_transmission } from "../../../models/Jufo_verification_transmission";
import { Lecture } from "../../../models/Lecture";
import { Match } from "../../../models/Match";
import { Participation_certificate } from "../../../models/Participation_certificate";
import { Project_coaching_screening } from "../../../models/Project_coaching_screening";
import { Project_field_with_grade_restriction } from "../../../models/Project_field_with_grade_restriction";
import { Project_match } from "../../../models/Project_match";
import { Screening } from "../../../models/Screening";
import { Student } from "../../../models/Student";
import { Subcourse_instructors_student } from "../../../models/Subcourse_instructors_student";
import { StudentCertificate_of_conductArgs } from "./args/StudentCertificate_of_conductArgs";
import { StudentCourseArgs } from "./args/StudentCourseArgs";
import { StudentCourse_guestArgs } from "./args/StudentCourse_guestArgs";
import { StudentCourse_instructors_studentArgs } from "./args/StudentCourse_instructors_studentArgs";
import { StudentCourse_participation_certificateArgs } from "./args/StudentCourse_participation_certificateArgs";
import { StudentLectureArgs } from "./args/StudentLectureArgs";
import { StudentMatchArgs } from "./args/StudentMatchArgs";
import { StudentParticipation_certificateArgs } from "./args/StudentParticipation_certificateArgs";
import { StudentProject_field_with_grade_restrictionArgs } from "./args/StudentProject_field_with_grade_restrictionArgs";
import { StudentProject_matchArgs } from "./args/StudentProject_matchArgs";
import { StudentSubcourse_instructors_studentArgs } from "./args/StudentSubcourse_instructors_studentArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Student)
export class StudentRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => [Course], {
    nullable: false
  })
  async course(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentCourseArgs): Promise<Course[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).course(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Course_guest], {
    nullable: false
  })
  async course_guest(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentCourse_guestArgs): Promise<Course_guest[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).course_guest(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Course_instructors_student], {
    nullable: false
  })
  async course_instructors_student(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentCourse_instructors_studentArgs): Promise<Course_instructors_student[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).course_instructors_student(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Course_participation_certificate], {
    nullable: false
  })
  async course_participation_certificate(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentCourse_participation_certificateArgs): Promise<Course_participation_certificate[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).course_participation_certificate(args);
  }

  @TypeGraphQL.FieldResolver(_type => Expert_data, {
    nullable: true
  })
  async expert_data(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any): Promise<Expert_data | null> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).expert_data({});
  }

  @TypeGraphQL.FieldResolver(_type => Instructor_screening, {
    nullable: true
  })
  async instructor_screening(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any): Promise<Instructor_screening | null> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).instructor_screening({});
  }

  @TypeGraphQL.FieldResolver(_type => Jufo_verification_transmission, {
    nullable: true
  })
  async jufo_verification_transmission(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any): Promise<Jufo_verification_transmission | null> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).jufo_verification_transmission({});
  }

  @TypeGraphQL.FieldResolver(_type => [Lecture], {
    nullable: false
  })
  async lecture(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentLectureArgs): Promise<Lecture[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).lecture(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Match], {
    nullable: false
  })
  async match(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentMatchArgs): Promise<Match[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).match(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Participation_certificate], {
    nullable: false
  })
  async participation_certificate(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentParticipation_certificateArgs): Promise<Participation_certificate[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).participation_certificate(args);
  }

  @TypeGraphQL.FieldResolver(_type => Project_coaching_screening, {
    nullable: true
  })
  async project_coaching_screening(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any): Promise<Project_coaching_screening | null> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).project_coaching_screening({});
  }

  @TypeGraphQL.FieldResolver(_type => [Project_field_with_grade_restriction], {
    nullable: false
  })
  async project_field_with_grade_restriction(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).project_field_with_grade_restriction(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Project_match], {
    nullable: false
  })
  async project_match(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentProject_matchArgs): Promise<Project_match[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).project_match(args);
  }

  @TypeGraphQL.FieldResolver(_type => Screening, {
    nullable: true
  })
  async screening(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any): Promise<Screening | null> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).screening({});
  }

  @TypeGraphQL.FieldResolver(_type => [Subcourse_instructors_student], {
    nullable: false
  })
  async subcourse_instructors_student(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).subcourse_instructors_student(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Certificate_of_conduct], {
    nullable: false
  })
  async certificate_of_conduct(@TypeGraphQL.Root() student: Student, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: StudentCertificate_of_conductArgs): Promise<Certificate_of_conduct[]> {
    return getPrismaFromContext(ctx).student.findUnique({
      where: {
        id: student.id,
      },
    }).certificate_of_conduct(args);
  }
}
