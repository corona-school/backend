import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateSubcourse_participants_pupilArgs } from "./args/AggregateSubcourse_participants_pupilArgs";
import { Subcourse_participants_pupil } from "../../../models/Subcourse_participants_pupil";
import { AggregateSubcourse_participants_pupil } from "../../outputs/AggregateSubcourse_participants_pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_participants_pupil)
export class AggregateSubcourse_participants_pupilResolver {
  @TypeGraphQL.Query(_returns => AggregateSubcourse_participants_pupil, {
    nullable: false
  })
  async aggregateSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateSubcourse_participants_pupilArgs): Promise<AggregateSubcourse_participants_pupil> {
    return getPrismaFromContext(ctx).subcourse_participants_pupil.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
