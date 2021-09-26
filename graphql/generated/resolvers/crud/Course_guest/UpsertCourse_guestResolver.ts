import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertCourse_guestArgs } from "./args/UpsertCourse_guestArgs";
import { Course_guest } from "../../../models/Course_guest";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_guest)
export class UpsertCourse_guestResolver {
  @TypeGraphQL.Mutation(_returns => Course_guest, {
    nullable: false
  })
  async upsertCourse_guest(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertCourse_guestArgs): Promise<Course_guest> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_guest.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
