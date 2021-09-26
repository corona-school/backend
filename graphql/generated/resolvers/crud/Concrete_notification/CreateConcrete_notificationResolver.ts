import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { CreateConcrete_notificationArgs } from "./args/CreateConcrete_notificationArgs";
import { Concrete_notification } from "../../../models/Concrete_notification";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Concrete_notification)
export class CreateConcrete_notificationResolver {
  @TypeGraphQL.Mutation(_returns => Concrete_notification, {
    nullable: false
  })
  async createConcrete_notification(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateConcrete_notificationArgs): Promise<Concrete_notification> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).concrete_notification.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
