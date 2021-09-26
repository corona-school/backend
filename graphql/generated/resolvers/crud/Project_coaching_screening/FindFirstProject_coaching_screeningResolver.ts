import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindFirstProject_coaching_screeningArgs } from "./args/FindFirstProject_coaching_screeningArgs";
import { Project_coaching_screening } from "../../../models/Project_coaching_screening";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_coaching_screening)
export class FindFirstProject_coaching_screeningResolver {
  @TypeGraphQL.Query(_returns => Project_coaching_screening, {
    nullable: true
  })
  async findFirstProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstProject_coaching_screeningArgs): Promise<Project_coaching_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
