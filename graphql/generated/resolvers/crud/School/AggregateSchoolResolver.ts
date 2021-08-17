import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateSchoolArgs } from "./args/AggregateSchoolArgs";
import { School } from "../../../models/School";
import { AggregateSchool } from "../../outputs/AggregateSchool";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => School)
export class AggregateSchoolResolver {
  @TypeGraphQL.Query(_returns => AggregateSchool, {
    nullable: false
  })
  async aggregateSchool(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateSchoolArgs): Promise<AggregateSchool> {
    return getPrismaFromContext(ctx).school.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
