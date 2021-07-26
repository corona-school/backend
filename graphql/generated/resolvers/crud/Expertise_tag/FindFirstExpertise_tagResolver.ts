import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindFirstExpertise_tagArgs } from "./args/FindFirstExpertise_tagArgs";
import { Expertise_tag } from "../../../models/Expertise_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expertise_tag)
export class FindFirstExpertise_tagResolver {
  @TypeGraphQL.Query(_returns => Expertise_tag, {
    nullable: true
  })
  async findFirstExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstExpertise_tagArgs): Promise<Expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
