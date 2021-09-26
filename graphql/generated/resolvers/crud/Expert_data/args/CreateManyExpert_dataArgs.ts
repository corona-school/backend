import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataCreateManyInput } from "../../../inputs/Expert_dataCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyExpert_dataArgs {
  @TypeGraphQL.Field(_type => [Expert_dataCreateManyInput], {
    nullable: false
  })
  data!: Expert_dataCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
