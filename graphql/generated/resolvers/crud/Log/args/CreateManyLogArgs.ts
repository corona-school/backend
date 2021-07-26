import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogCreateManyInput } from "../../../inputs/LogCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyLogArgs {
  @TypeGraphQL.Field(_type => [LogCreateManyInput], {
    nullable: false
  })
  data!: LogCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
