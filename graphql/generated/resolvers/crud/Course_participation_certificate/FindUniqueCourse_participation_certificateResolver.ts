import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindUniqueCourse_participation_certificateArgs } from "./args/FindUniqueCourse_participation_certificateArgs";
import { Course_participation_certificate } from "../../../models/Course_participation_certificate";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_participation_certificate)
export class FindUniqueCourse_participation_certificateResolver {
  @TypeGraphQL.Query(_returns => Course_participation_certificate, {
    nullable: true
  })
  async course_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueCourse_participation_certificateArgs): Promise<Course_participation_certificate | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
