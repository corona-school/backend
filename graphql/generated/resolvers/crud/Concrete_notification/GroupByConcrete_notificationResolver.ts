import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByConcrete_notificationArgs } from "./args/GroupByConcrete_notificationArgs";
import { Concrete_notification } from "../../../models/Concrete_notification";
import { Concrete_notificationGroupBy } from "../../outputs/Concrete_notificationGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Concrete_notification)
export class GroupByConcrete_notificationResolver {
  @TypeGraphQL.Query(_returns => [Concrete_notificationGroupBy], {
    nullable: false
  })
  async groupByConcrete_notification(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByConcrete_notificationArgs): Promise<Concrete_notificationGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).concrete_notification.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
