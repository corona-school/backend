import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { StudentUpdateManyMutationInput } from "../../../inputs/StudentUpdateManyMutationInput";
import { StudentWhereInput } from "../../../inputs/StudentWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyStudentArgs {
  @TypeGraphQL.Field(_type => StudentUpdateManyMutationInput, {
    nullable: false
  })
  data!: StudentUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => StudentWhereInput, {
    nullable: true
  })
  where?: StudentWhereInput | undefined;
}
