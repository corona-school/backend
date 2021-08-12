import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseCreateManyInput } from "../../../inputs/SubcourseCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManySubcourseArgs {
  @TypeGraphQL.Field(_type => [SubcourseCreateManyInput], {
    nullable: false
  })
  data!: SubcourseCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
