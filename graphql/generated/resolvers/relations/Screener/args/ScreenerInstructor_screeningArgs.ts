import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Instructor_screeningOrderByWithRelationInput } from "../../../inputs/Instructor_screeningOrderByWithRelationInput";
import { Instructor_screeningWhereInput } from "../../../inputs/Instructor_screeningWhereInput";
import { Instructor_screeningWhereUniqueInput } from "../../../inputs/Instructor_screeningWhereUniqueInput";
import { Instructor_screeningScalarFieldEnum } from "../../../../enums/Instructor_screeningScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class ScreenerInstructor_screeningArgs {
  @TypeGraphQL.Field(_type => Instructor_screeningWhereInput, {
    nullable: true
  })
  where?: Instructor_screeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Instructor_screeningOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningWhereUniqueInput, {
    nullable: true
  })
  cursor?: Instructor_screeningWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "success" | "comment" | "knowsCoronaSchoolFrom" | "createdAt" | "updatedAt" | "screenerId" | "studentId"> | undefined;
}
