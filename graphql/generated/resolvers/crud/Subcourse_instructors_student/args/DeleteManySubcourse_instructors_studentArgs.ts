import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_instructors_studentWhereInput } from "../../../inputs/Subcourse_instructors_studentWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManySubcourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereInput, {
    nullable: true
  })
  where?: Subcourse_instructors_studentWhereInput | undefined;
}
