import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertExpert_dataArgs } from "./args/UpsertExpert_dataArgs";
import { Expert_data } from "../../../models/Expert_data";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data)
export class UpsertExpert_dataResolver {
  @TypeGraphQL.Mutation(_returns => Expert_data, {
    nullable: false
  })
  async upsertExpert_data(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertExpert_dataArgs): Promise<Expert_data> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
