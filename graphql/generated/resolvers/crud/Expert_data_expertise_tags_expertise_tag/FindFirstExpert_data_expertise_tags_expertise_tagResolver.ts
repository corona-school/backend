import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindFirstExpert_data_expertise_tags_expertise_tagArgs } from "./args/FindFirstExpert_data_expertise_tags_expertise_tagArgs";
import { Expert_data_expertise_tags_expertise_tag } from "../../../models/Expert_data_expertise_tags_expertise_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data_expertise_tags_expertise_tag)
export class FindFirstExpert_data_expertise_tags_expertise_tagResolver {
  @TypeGraphQL.Query(_returns => Expert_data_expertise_tags_expertise_tag, {
    nullable: true
  })
  async findFirstExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
