import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SchoolUpdateInput } from "../../../inputs/SchoolUpdateInput";
import { SchoolWhereUniqueInput } from "../../../inputs/SchoolWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateSchoolArgs {
  @TypeGraphQL.Field(_type => SchoolUpdateInput, {
    nullable: false
  })
  data!: SchoolUpdateInput;

  @TypeGraphQL.Field(_type => SchoolWhereUniqueInput, {
    nullable: false
  })
  where!: SchoolWhereUniqueInput;
}
