import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateConcrete_notificationArgs } from "./args/AggregateConcrete_notificationArgs";
import { Concrete_notification } from "../../../models/Concrete_notification";
import { AggregateConcrete_notification } from "../../outputs/AggregateConcrete_notification";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Concrete_notification)
export class AggregateConcrete_notificationResolver {
  @TypeGraphQL.Query(_returns => AggregateConcrete_notification, {
    nullable: false
  })
  async aggregateConcrete_notification(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateConcrete_notificationArgs): Promise<AggregateConcrete_notification> {
    return getPrismaFromContext(ctx).concrete_notification.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
