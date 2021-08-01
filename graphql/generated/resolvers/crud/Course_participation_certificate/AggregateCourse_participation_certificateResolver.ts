import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourse_participation_certificateArgs } from "./args/AggregateCourse_participation_certificateArgs";
import { Course_participation_certificate } from "../../../models/Course_participation_certificate";
import { AggregateCourse_participation_certificate } from "../../outputs/AggregateCourse_participation_certificate";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_participation_certificate)
export class AggregateCourse_participation_certificateResolver {
  @TypeGraphQL.Query(_returns => AggregateCourse_participation_certificate, {
    nullable: false
  })
  async aggregateCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourse_participation_certificateArgs): Promise<AggregateCourse_participation_certificate> {
    return getPrismaFromContext(ctx).course_participation_certificate.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
