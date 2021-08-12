import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByExpertise_tagArgs } from "./args/GroupByExpertise_tagArgs";
import { Expertise_tag } from "../../../models/Expertise_tag";
import { Expertise_tagGroupBy } from "../../outputs/Expertise_tagGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expertise_tag)
export class GroupByExpertise_tagResolver {
  @TypeGraphQL.Query(_returns => [Expertise_tagGroupBy], {
    nullable: false
  })
  async groupByExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByExpertise_tagArgs): Promise<Expertise_tagGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
