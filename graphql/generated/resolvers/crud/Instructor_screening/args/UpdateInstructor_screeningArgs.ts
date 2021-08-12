import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Instructor_screeningUpdateInput } from "../../../inputs/Instructor_screeningUpdateInput";
import { Instructor_screeningWhereUniqueInput } from "../../../inputs/Instructor_screeningWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateInstructor_screeningArgs {
  @TypeGraphQL.Field(_type => Instructor_screeningUpdateInput, {
    nullable: false
  })
  data!: Instructor_screeningUpdateInput;

  @TypeGraphQL.Field(_type => Instructor_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Instructor_screeningWhereUniqueInput;
}
