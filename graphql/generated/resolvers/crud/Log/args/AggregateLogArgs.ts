import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogOrderByWithRelationInput } from "../../../inputs/LogOrderByWithRelationInput";
import { LogWhereInput } from "../../../inputs/LogWhereInput";
import { LogWhereUniqueInput } from "../../../inputs/LogWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateLogArgs {
  @TypeGraphQL.Field(_type => LogWhereInput, {
    nullable: true
  })
  where?: LogWhereInput | undefined;

  @TypeGraphQL.Field(_type => [LogOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: LogOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => LogWhereUniqueInput, {
    nullable: true
  })
  cursor?: LogWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
