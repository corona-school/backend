import * as TypeGraphQL from "type-graphql";
import { Course } from "../../../models/Course";
import { Course_instructors_student } from "../../../models/Course_instructors_student";
import { Course_tags_course_tag } from "../../../models/Course_tags_course_tag";
import { Student } from "../../../models/Student";
import { Subcourse } from "../../../models/Subcourse";
import { CourseCourse_instructors_studentArgs } from "./args/CourseCourse_instructors_studentArgs";
import { CourseCourse_tags_course_tagArgs } from "./args/CourseCourse_tags_course_tagArgs";
import { CourseSubcourseArgs } from "./args/CourseSubcourseArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course)
export class CourseRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() course: Course, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).course.findUnique({
      where: {
        id: course.id,
      },
    }).student({});
  }

  @TypeGraphQL.FieldResolver(_type => [Course_instructors_student], {
    nullable: false
  })
  async course_instructors_student(@TypeGraphQL.Root() course: Course, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CourseCourse_instructors_studentArgs): Promise<Course_instructors_student[]> {
    return getPrismaFromContext(ctx).course.findUnique({
      where: {
        id: course.id,
      },
    }).course_instructors_student(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Course_tags_course_tag], {
    nullable: false
  })
  async course_tags_course_tag(@TypeGraphQL.Root() course: Course, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CourseCourse_tags_course_tagArgs): Promise<Course_tags_course_tag[]> {
    return getPrismaFromContext(ctx).course.findUnique({
      where: {
        id: course.id,
      },
    }).course_tags_course_tag(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Subcourse], {
    nullable: false
  })
  async subcourse(@TypeGraphQL.Root() course: Course, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CourseSubcourseArgs): Promise<Subcourse[]> {
    return getPrismaFromContext(ctx).course.findUnique({
      where: {
        id: course.id,
      },
    }).subcourse(args);
  }
}
