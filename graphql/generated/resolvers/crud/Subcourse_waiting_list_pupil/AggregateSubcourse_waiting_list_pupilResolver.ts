import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateSubcourse_waiting_list_pupilArgs } from "./args/AggregateSubcourse_waiting_list_pupilArgs";
import { Subcourse_waiting_list_pupil } from "../../../models/Subcourse_waiting_list_pupil";
import { AggregateSubcourse_waiting_list_pupil } from "../../outputs/AggregateSubcourse_waiting_list_pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_waiting_list_pupil)
export class AggregateSubcourse_waiting_list_pupilResolver {
  @TypeGraphQL.Query(_returns => AggregateSubcourse_waiting_list_pupil, {
    nullable: false
  })
  async aggregateSubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateSubcourse_waiting_list_pupilArgs): Promise<AggregateSubcourse_waiting_list_pupil> {
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
