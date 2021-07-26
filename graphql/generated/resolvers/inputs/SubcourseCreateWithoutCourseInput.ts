import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateNestedManyWithoutSubcourseInput } from "../inputs/LectureCreateNestedManyWithoutSubcourseInput";
import { Subcourse_instructors_studentCreateNestedManyWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentCreateNestedManyWithoutSubcourseInput";
import { Subcourse_participants_pupilCreateNestedManyWithoutSubcourseInput } from "../inputs/Subcourse_participants_pupilCreateNestedManyWithoutSubcourseInput";
import { Subcourse_waiting_list_pupilCreateNestedManyWithoutSubcourseInput } from "../inputs/Subcourse_waiting_list_pupilCreateNestedManyWithoutSubcourseInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseCreateWithoutCourseInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  minGrade!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  maxGrade!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  maxParticipants!: number;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  published!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  cancelled?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  joinAfterStart?: boolean | undefined;

  @TypeGraphQL.Field(_type => LectureCreateNestedManyWithoutSubcourseInput, {
    nullable: true
  })
  lecture?: LectureCreateNestedManyWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCreateNestedManyWithoutSubcourseInput, {
    nullable: true
  })
  subcourse_instructors_student?: Subcourse_instructors_studentCreateNestedManyWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilCreateNestedManyWithoutSubcourseInput, {
    nullable: true
  })
  subcourse_participants_pupil?: Subcourse_participants_pupilCreateNestedManyWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCreateNestedManyWithoutSubcourseInput, {
    nullable: true
  })
  subcourse_waiting_list_pupil?: Subcourse_waiting_list_pupilCreateNestedManyWithoutSubcourseInput | undefined;
}
