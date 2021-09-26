import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindManySubcourseArgs } from "./args/FindManySubcourseArgs";
import { Subcourse } from "../../../models/Subcourse";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse)
export class FindManySubcourseResolver {
  @TypeGraphQL.Query(_returns => [Subcourse], {
    nullable: false
  })
  async subcourses(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManySubcourseArgs): Promise<Subcourse[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
