import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpdateMigrationsArgs } from "./args/UpdateMigrationsArgs";
import { Migrations } from "../../../models/Migrations";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Migrations)
export class UpdateMigrationsResolver {
  @TypeGraphQL.Mutation(_returns => Migrations, {
    nullable: true
  })
  async updateMigrations(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateMigrationsArgs): Promise<Migrations | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).migrations.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
