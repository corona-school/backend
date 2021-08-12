import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindManyCourse_participation_certificateArgs } from "./args/FindManyCourse_participation_certificateArgs";
import { Course_participation_certificate } from "../../../models/Course_participation_certificate";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_participation_certificate)
export class FindManyCourse_participation_certificateResolver {
  @TypeGraphQL.Query(_returns => [Course_participation_certificate], {
    nullable: false
  })
  async course_participation_certificates(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyCourse_participation_certificateArgs): Promise<Course_participation_certificate[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
