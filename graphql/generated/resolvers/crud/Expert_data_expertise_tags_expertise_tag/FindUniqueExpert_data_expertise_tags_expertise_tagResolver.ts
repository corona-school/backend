import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindUniqueExpert_data_expertise_tags_expertise_tagArgs } from "./args/FindUniqueExpert_data_expertise_tags_expertise_tagArgs";
import { Expert_data_expertise_tags_expertise_tag } from "../../../models/Expert_data_expertise_tags_expertise_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data_expertise_tags_expertise_tag)
export class FindUniqueExpert_data_expertise_tags_expertise_tagResolver {
  @TypeGraphQL.Query(_returns => Expert_data_expertise_tags_expertise_tag, {
    nullable: true
  })
  async expert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
