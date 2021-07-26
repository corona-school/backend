import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntFilter } from "../inputs/IntFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MigrationsWhereInput {
  @TypeGraphQL.Field(_type => [MigrationsWhereInput], {
    nullable: true
  })
  AND?: MigrationsWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [MigrationsWhereInput], {
    nullable: true
  })
  OR?: MigrationsWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [MigrationsWhereInput], {
    nullable: true
  })
  NOT?: MigrationsWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  timestamp?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  name?: StringFilter | undefined;
}
