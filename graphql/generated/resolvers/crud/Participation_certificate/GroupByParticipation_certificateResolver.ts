import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByParticipation_certificateArgs } from "./args/GroupByParticipation_certificateArgs";
import { Participation_certificate } from "../../../models/Participation_certificate";
import { Participation_certificateGroupBy } from "../../outputs/Participation_certificateGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Participation_certificate)
export class GroupByParticipation_certificateResolver {
  @TypeGraphQL.Query(_returns => [Participation_certificateGroupBy], {
    nullable: false
  })
  async groupByParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByParticipation_certificateArgs): Promise<Participation_certificateGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
