import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Remission_requestCreateManyInput } from "../../../inputs/Remission_requestCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyRemission_requestArgs {
  @TypeGraphQL.Field(_type => [Remission_requestCreateManyInput], {
    nullable: false
  })
  data!: Remission_requestCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
