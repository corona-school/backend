import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { CreateCourse_guestArgs } from "./args/CreateCourse_guestArgs";
import { Course_guest } from "../../../models/Course_guest";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_guest)
export class CreateCourse_guestResolver {
  @TypeGraphQL.Mutation(_returns => Course_guest, {
    nullable: false
  })
  async createCourse_guest(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateCourse_guestArgs): Promise<Course_guest> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_guest.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
