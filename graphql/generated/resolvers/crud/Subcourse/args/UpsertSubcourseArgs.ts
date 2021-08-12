import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseCreateInput } from "../../../inputs/SubcourseCreateInput";
import { SubcourseUpdateInput } from "../../../inputs/SubcourseUpdateInput";
import { SubcourseWhereUniqueInput } from "../../../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertSubcourseArgs {
  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: false
  })
  where!: SubcourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => SubcourseCreateInput, {
    nullable: false
  })
  create!: SubcourseCreateInput;

  @TypeGraphQL.Field(_type => SubcourseUpdateInput, {
    nullable: false
  })
  update!: SubcourseUpdateInput;
}
