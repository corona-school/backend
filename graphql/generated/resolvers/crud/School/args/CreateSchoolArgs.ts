import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SchoolCreateInput } from "../../../inputs/SchoolCreateInput";

@TypeGraphQL.ArgsType()
export class CreateSchoolArgs {
  @TypeGraphQL.Field(_type => SchoolCreateInput, {
    nullable: false
  })
  data!: SchoolCreateInput;
}
