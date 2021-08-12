import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { StudentCreateInput } from "../../../inputs/StudentCreateInput";
import { StudentUpdateInput } from "../../../inputs/StudentUpdateInput";
import { StudentWhereUniqueInput } from "../../../inputs/StudentWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertStudentArgs {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateInput, {
    nullable: false
  })
  create!: StudentCreateInput;

  @TypeGraphQL.Field(_type => StudentUpdateInput, {
    nullable: false
  })
  update!: StudentUpdateInput;
}
