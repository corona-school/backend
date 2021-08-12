import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateProject_coaching_screeningArgs } from "./args/AggregateProject_coaching_screeningArgs";
import { Project_coaching_screening } from "../../../models/Project_coaching_screening";
import { AggregateProject_coaching_screening } from "../../outputs/AggregateProject_coaching_screening";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_coaching_screening)
export class AggregateProject_coaching_screeningResolver {
  @TypeGraphQL.Query(_returns => AggregateProject_coaching_screening, {
    nullable: false
  })
  async aggregateProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateProject_coaching_screeningArgs): Promise<AggregateProject_coaching_screening> {
    return getPrismaFromContext(ctx).project_coaching_screening.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
