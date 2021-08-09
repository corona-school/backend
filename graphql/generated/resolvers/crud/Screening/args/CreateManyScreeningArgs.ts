import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreeningCreateManyInput } from "../../../inputs/ScreeningCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyScreeningArgs {
  @TypeGraphQL.Field(_type => [ScreeningCreateManyInput], {
    nullable: false
  })
  data!: ScreeningCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
