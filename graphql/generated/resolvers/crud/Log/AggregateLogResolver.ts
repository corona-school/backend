import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateLogArgs } from "./args/AggregateLogArgs";
import { Log } from "../../../models/Log";
import { AggregateLog } from "../../outputs/AggregateLog";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Log)
export class AggregateLogResolver {
  @TypeGraphQL.Query(_returns => AggregateLog, {
    nullable: false
  })
  async aggregateLog(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateLogArgs): Promise<AggregateLog> {
    return getPrismaFromContext(ctx).log.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
