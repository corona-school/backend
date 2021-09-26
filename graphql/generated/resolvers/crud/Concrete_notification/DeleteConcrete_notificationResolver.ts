import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DeleteConcrete_notificationArgs } from "./args/DeleteConcrete_notificationArgs";
import { Concrete_notification } from "../../../models/Concrete_notification";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Concrete_notification)
export class DeleteConcrete_notificationResolver {
  @TypeGraphQL.Mutation(_returns => Concrete_notification, {
    nullable: true
  })
  async deleteConcrete_notification(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteConcrete_notificationArgs): Promise<Concrete_notification | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).concrete_notification.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
