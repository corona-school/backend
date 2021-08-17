import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateScreeningArgs } from "./args/AggregateScreeningArgs";
import { Screening } from "../../../models/Screening";
import { AggregateScreening } from "../../outputs/AggregateScreening";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Screening)
export class AggregateScreeningResolver {
  @TypeGraphQL.Query(_returns => AggregateScreening, {
    nullable: false
  })
  async aggregateScreening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateScreeningArgs): Promise<AggregateScreening> {
    return getPrismaFromContext(ctx).screening.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
