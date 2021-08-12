import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpdateConcrete_notificationArgs } from "./args/UpdateConcrete_notificationArgs";
import { Concrete_notification } from "../../../models/Concrete_notification";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Concrete_notification)
export class UpdateConcrete_notificationResolver {
  @TypeGraphQL.Mutation(_returns => Concrete_notification, {
    nullable: true
  })
  async updateConcrete_notification(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateConcrete_notificationArgs): Promise<Concrete_notification | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).concrete_notification.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
