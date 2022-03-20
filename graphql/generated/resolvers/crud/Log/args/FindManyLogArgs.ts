import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogOrderByWithRelationInput } from "../../../inputs/LogOrderByWithRelationInput";
import { LogWhereInput } from "../../../inputs/LogWhereInput";
import { LogWhereUniqueInput } from "../../../inputs/LogWhereUniqueInput";
import { LogScalarFieldEnum } from "../../../../enums/LogScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyLogArgs {
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

  @TypeGraphQL.Field(_type => [LogScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "logtype" | "createdAt" | "user" | "data"> | undefined;
}
