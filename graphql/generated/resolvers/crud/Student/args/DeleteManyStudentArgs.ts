import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { StudentWhereInput } from "../../../inputs/StudentWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyStudentArgs {
  @TypeGraphQL.Field(_type => StudentWhereInput, {
    nullable: true
  })
  where?: StudentWhereInput | undefined;
}
