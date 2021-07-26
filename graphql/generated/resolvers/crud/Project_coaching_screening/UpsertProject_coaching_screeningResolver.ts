import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertProject_coaching_screeningArgs } from "./args/UpsertProject_coaching_screeningArgs";
import { Project_coaching_screening } from "../../../models/Project_coaching_screening";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_coaching_screening)
export class UpsertProject_coaching_screeningResolver {
  @TypeGraphQL.Mutation(_returns => Project_coaching_screening, {
    nullable: false
  })
  async upsertProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertProject_coaching_screeningArgs): Promise<Project_coaching_screening> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
