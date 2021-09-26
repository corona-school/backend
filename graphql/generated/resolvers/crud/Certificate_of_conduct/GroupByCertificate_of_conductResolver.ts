import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByCertificate_of_conductArgs } from "./args/GroupByCertificate_of_conductArgs";
import { Certificate_of_conduct } from "../../../models/Certificate_of_conduct";
import { Certificate_of_conductGroupBy } from "../../outputs/Certificate_of_conductGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Certificate_of_conduct)
export class GroupByCertificate_of_conductResolver {
  @TypeGraphQL.Query(_returns => [Certificate_of_conductGroupBy], {
    nullable: false
  })
  async groupByCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByCertificate_of_conductArgs): Promise<Certificate_of_conductGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
