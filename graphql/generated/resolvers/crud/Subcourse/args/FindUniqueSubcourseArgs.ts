import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseWhereUniqueInput } from "../../../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueSubcourseArgs {
  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: false
  })
  where!: SubcourseWhereUniqueInput;
}
