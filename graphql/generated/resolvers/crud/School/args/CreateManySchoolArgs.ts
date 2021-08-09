import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SchoolCreateManyInput } from "../../../inputs/SchoolCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManySchoolArgs {
  @TypeGraphQL.Field(_type => [SchoolCreateManyInput], {
    nullable: false
  })
  data!: SchoolCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
