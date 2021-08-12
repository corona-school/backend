import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateExpert_dataArgs } from "./args/AggregateExpert_dataArgs";
import { Expert_data } from "../../../models/Expert_data";
import { AggregateExpert_data } from "../../outputs/AggregateExpert_data";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data)
export class AggregateExpert_dataResolver {
  @TypeGraphQL.Query(_returns => AggregateExpert_data, {
    nullable: false
  })
  async aggregateExpert_data(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateExpert_dataArgs): Promise<AggregateExpert_data> {
    return getPrismaFromContext(ctx).expert_data.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
