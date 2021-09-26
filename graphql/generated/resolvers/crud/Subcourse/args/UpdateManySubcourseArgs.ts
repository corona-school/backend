import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseUpdateManyMutationInput } from "../../../inputs/SubcourseUpdateManyMutationInput";
import { SubcourseWhereInput } from "../../../inputs/SubcourseWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManySubcourseArgs {
  @TypeGraphQL.Field(_type => SubcourseUpdateManyMutationInput, {
    nullable: false
  })
  data!: SubcourseUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => SubcourseWhereInput, {
    nullable: true
  })
  where?: SubcourseWhereInput | undefined;
}
