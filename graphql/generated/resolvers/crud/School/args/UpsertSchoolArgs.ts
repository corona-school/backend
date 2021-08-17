import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SchoolCreateInput } from "../../../inputs/SchoolCreateInput";
import { SchoolUpdateInput } from "../../../inputs/SchoolUpdateInput";
import { SchoolWhereUniqueInput } from "../../../inputs/SchoolWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertSchoolArgs {
  @TypeGraphQL.Field(_type => SchoolWhereUniqueInput, {
    nullable: false
  })
  where!: SchoolWhereUniqueInput;

  @TypeGraphQL.Field(_type => SchoolCreateInput, {
    nullable: false
  })
  create!: SchoolCreateInput;

  @TypeGraphQL.Field(_type => SchoolUpdateInput, {
    nullable: false
  })
  update!: SchoolUpdateInput;
}
