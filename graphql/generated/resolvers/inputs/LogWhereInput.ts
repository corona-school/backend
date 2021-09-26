import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { Enumlog_logtype_enumFilter } from "../inputs/Enumlog_logtype_enumFilter";
import { IntFilter } from "../inputs/IntFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LogWhereInput {
  @TypeGraphQL.Field(_type => [LogWhereInput], {
    nullable: true
  })
  AND?: LogWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [LogWhereInput], {
    nullable: true
  })
  OR?: LogWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [LogWhereInput], {
    nullable: true
  })
  NOT?: LogWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => Enumlog_logtype_enumFilter, {
    nullable: true
  })
  logtype?: Enumlog_logtype_enumFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  user?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  data?: StringFilter | undefined;
}
