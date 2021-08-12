import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { NestedJsonFilter } from "../inputs/NestedJsonFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class JsonWithAggregatesFilter {
  @TypeGraphQL.Field(_type => GraphQLScalars.JSONResolver, {
    nullable: true
  })
  equals?: Prisma.InputJsonValue | undefined;

  @TypeGraphQL.Field(_type => GraphQLScalars.JSONResolver, {
    nullable: true
  })
  not?: Prisma.InputJsonValue | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedJsonFilter, {
    nullable: true
  })
  _min?: NestedJsonFilter | undefined;

  @TypeGraphQL.Field(_type => NestedJsonFilter, {
    nullable: true
  })
  _max?: NestedJsonFilter | undefined;
}
