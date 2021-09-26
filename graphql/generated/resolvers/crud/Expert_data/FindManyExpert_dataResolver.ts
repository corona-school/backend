import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindManyExpert_dataArgs } from "./args/FindManyExpert_dataArgs";
import { Expert_data } from "../../../models/Expert_data";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data)
export class FindManyExpert_dataResolver {
  @TypeGraphQL.Query(_returns => [Expert_data], {
    nullable: false
  })
  async findManyExpert_data(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyExpert_dataArgs): Promise<Expert_data[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
