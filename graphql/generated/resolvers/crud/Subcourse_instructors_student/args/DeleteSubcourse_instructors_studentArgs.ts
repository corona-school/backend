import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_instructors_studentWhereUniqueInput } from "../../../inputs/Subcourse_instructors_studentWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteSubcourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_instructors_studentWhereUniqueInput;
}
