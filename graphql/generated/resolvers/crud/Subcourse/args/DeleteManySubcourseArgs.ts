import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseWhereInput } from "../../../inputs/SubcourseWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManySubcourseArgs {
  @TypeGraphQL.Field(_type => SubcourseWhereInput, {
    nullable: true
  })
  where?: SubcourseWhereInput | undefined;
}
