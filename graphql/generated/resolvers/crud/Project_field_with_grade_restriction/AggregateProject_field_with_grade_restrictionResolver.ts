import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateProject_field_with_grade_restrictionArgs } from "./args/AggregateProject_field_with_grade_restrictionArgs";
import { Project_field_with_grade_restriction } from "../../../models/Project_field_with_grade_restriction";
import { AggregateProject_field_with_grade_restriction } from "../../outputs/AggregateProject_field_with_grade_restriction";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_field_with_grade_restriction)
export class AggregateProject_field_with_grade_restrictionResolver {
  @TypeGraphQL.Query(_returns => AggregateProject_field_with_grade_restriction, {
    nullable: false
  })
  async aggregateProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateProject_field_with_grade_restrictionArgs): Promise<AggregateProject_field_with_grade_restriction> {
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
