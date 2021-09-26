import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregatePupilArgs } from "./args/AggregatePupilArgs";
import { Pupil } from "../../../models/Pupil";
import { AggregatePupil } from "../../outputs/AggregatePupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Pupil)
export class AggregatePupilResolver {
  @TypeGraphQL.Query(_returns => AggregatePupil, {
    nullable: false
  })
  async aggregatePupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregatePupilArgs): Promise<AggregatePupil> {
    return getPrismaFromContext(ctx).pupil.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
