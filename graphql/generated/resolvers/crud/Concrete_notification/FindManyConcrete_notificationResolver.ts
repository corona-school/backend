import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindManyConcrete_notificationArgs } from "./args/FindManyConcrete_notificationArgs";
import { Concrete_notification } from "../../../models/Concrete_notification";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Concrete_notification)
export class FindManyConcrete_notificationResolver {
  @TypeGraphQL.Query(_returns => [Concrete_notification], {
    nullable: false
  })
  async concrete_notifications(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyConcrete_notificationArgs): Promise<Concrete_notification[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).concrete_notification.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
