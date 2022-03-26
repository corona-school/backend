import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchOrderByInput } from "../../../inputs/MatchOrderByInput";
import { MatchWhereInput } from "../../../inputs/MatchWhereInput";
import { MatchWhereUniqueInput } from "../../../inputs/MatchWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateMatchArgs {
  @TypeGraphQL.Field(_type => MatchWhereInput, {
    nullable: true
  })
  where?: MatchWhereInput | undefined;

  @TypeGraphQL.Field(_type => [MatchOrderByInput], {
    nullable: true
  })
  orderBy?: MatchOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => MatchWhereUniqueInput, {
    nullable: true
  })
  cursor?: MatchWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
