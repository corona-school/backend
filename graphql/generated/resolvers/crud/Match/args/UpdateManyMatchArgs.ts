import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchUpdateManyMutationInput } from "../../../inputs/MatchUpdateManyMutationInput";
import { MatchWhereInput } from "../../../inputs/MatchWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyMatchArgs {
  @TypeGraphQL.Field(_type => MatchUpdateManyMutationInput, {
    nullable: false
  })
  data!: MatchUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => MatchWhereInput, {
    nullable: true
  })
  where?: MatchWhereInput | undefined;
}
