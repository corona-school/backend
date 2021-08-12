import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseUpdateInput } from "../../../inputs/SubcourseUpdateInput";
import { SubcourseWhereUniqueInput } from "../../../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateSubcourseArgs {
  @TypeGraphQL.Field(_type => SubcourseUpdateInput, {
    nullable: false
  })
  data!: SubcourseUpdateInput;

  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: false
  })
  where!: SubcourseWhereUniqueInput;
}
