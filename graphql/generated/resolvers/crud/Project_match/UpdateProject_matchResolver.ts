import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpdateProject_matchArgs } from "./args/UpdateProject_matchArgs";
import { Project_match } from "../../../models/Project_match";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_match)
export class UpdateProject_matchResolver {
  @TypeGraphQL.Mutation(_returns => Project_match, {
    nullable: true
  })
  async updateProject_match(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateProject_matchArgs): Promise<Project_match | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_match.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
