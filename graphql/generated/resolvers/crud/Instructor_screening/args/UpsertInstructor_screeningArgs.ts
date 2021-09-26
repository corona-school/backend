import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Instructor_screeningCreateInput } from "../../../inputs/Instructor_screeningCreateInput";
import { Instructor_screeningUpdateInput } from "../../../inputs/Instructor_screeningUpdateInput";
import { Instructor_screeningWhereUniqueInput } from "../../../inputs/Instructor_screeningWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertInstructor_screeningArgs {
  @TypeGraphQL.Field(_type => Instructor_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Instructor_screeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => Instructor_screeningCreateInput, {
    nullable: false
  })
  create!: Instructor_screeningCreateInput;

  @TypeGraphQL.Field(_type => Instructor_screeningUpdateInput, {
    nullable: false
  })
  update!: Instructor_screeningUpdateInput;
}
