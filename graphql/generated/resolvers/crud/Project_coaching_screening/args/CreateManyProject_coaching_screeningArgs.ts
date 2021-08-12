import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_coaching_screeningCreateManyInput } from "../../../inputs/Project_coaching_screeningCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyProject_coaching_screeningArgs {
  @TypeGraphQL.Field(_type => [Project_coaching_screeningCreateManyInput], {
    nullable: false
  })
  data!: Project_coaching_screeningCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
