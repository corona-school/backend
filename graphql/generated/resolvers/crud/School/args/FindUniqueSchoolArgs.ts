import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SchoolWhereUniqueInput } from "../../../inputs/SchoolWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueSchoolArgs {
  @TypeGraphQL.Field(_type => SchoolWhereUniqueInput, {
    nullable: false
  })
  where!: SchoolWhereUniqueInput;
}
