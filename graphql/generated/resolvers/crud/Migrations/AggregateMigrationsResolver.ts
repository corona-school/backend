import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateMigrationsArgs } from "./args/AggregateMigrationsArgs";
import { Migrations } from "../../../models/Migrations";
import { AggregateMigrations } from "../../outputs/AggregateMigrations";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Migrations)
export class AggregateMigrationsResolver {
  @TypeGraphQL.Query(_returns => AggregateMigrations, {
    nullable: false
  })
  async aggregateMigrations(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateMigrationsArgs): Promise<AggregateMigrations> {
    return getPrismaFromContext(ctx).migrations.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
