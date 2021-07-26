import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_instructors_studentCreateInput } from "../../../inputs/Subcourse_instructors_studentCreateInput";

@TypeGraphQL.ArgsType()
export class CreateSubcourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCreateInput, {
    nullable: false
  })
  data!: Subcourse_instructors_studentCreateInput;
}
