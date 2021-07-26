import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindUniqueMigrationsArgs } from "./args/FindUniqueMigrationsArgs";
import { Migrations } from "../../../models/Migrations";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Migrations)
export class FindUniqueMigrationsResolver {
  @TypeGraphQL.Query(_returns => Migrations, {
    nullable: true
  })
  async findUniqueMigrations(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueMigrationsArgs): Promise<Migrations | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).migrations.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
