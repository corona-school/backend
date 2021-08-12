import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Instructor_screeningCreateInput } from "../../../inputs/Instructor_screeningCreateInput";

@TypeGraphQL.ArgsType()
export class CreateInstructor_screeningArgs {
  @TypeGraphQL.Field(_type => Instructor_screeningCreateInput, {
    nullable: false
  })
  data!: Instructor_screeningCreateInput;
}
