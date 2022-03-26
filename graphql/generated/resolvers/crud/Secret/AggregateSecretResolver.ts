import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateSecretArgs } from "./args/AggregateSecretArgs";
import { Secret } from "../../../models/Secret";
import { AggregateSecret } from "../../outputs/AggregateSecret";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Secret)
export class AggregateSecretResolver {
  @TypeGraphQL.Query(_returns => AggregateSecret, {
    nullable: false
  })
  async aggregateSecret(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateSecretArgs): Promise<AggregateSecret> {
    return getPrismaFromContext(ctx).secret.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
