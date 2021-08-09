import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseCreateInput } from "../../../inputs/SubcourseCreateInput";

@TypeGraphQL.ArgsType()
export class CreateSubcourseArgs {
  @TypeGraphQL.Field(_type => SubcourseCreateInput, {
    nullable: false
  })
  data!: SubcourseCreateInput;
}
