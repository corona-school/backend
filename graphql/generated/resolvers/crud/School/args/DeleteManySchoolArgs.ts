import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SchoolWhereInput } from "../../../inputs/SchoolWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManySchoolArgs {
  @TypeGraphQL.Field(_type => SchoolWhereInput, {
    nullable: true
  })
  where?: SchoolWhereInput | undefined;
}
