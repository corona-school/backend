import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateLectureArgs } from "./args/AggregateLectureArgs";
import { Lecture } from "../../../models/Lecture";
import { AggregateLecture } from "../../outputs/AggregateLecture";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Lecture)
export class AggregateLectureResolver {
  @TypeGraphQL.Query(_returns => AggregateLecture, {
    nullable: false
  })
  async aggregateLecture(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateLectureArgs): Promise<AggregateLecture> {
    return getPrismaFromContext(ctx).lecture.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
