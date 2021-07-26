import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindFirstMigrationsArgs } from "./args/FindFirstMigrationsArgs";
import { Migrations } from "../../../models/Migrations";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Migrations)
export class FindFirstMigrationsResolver {
  @TypeGraphQL.Query(_returns => Migrations, {
    nullable: true
  })
  async findFirstMigrations(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstMigrationsArgs): Promise<Migrations | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).migrations.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
