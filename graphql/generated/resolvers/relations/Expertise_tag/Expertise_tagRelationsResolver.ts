import * as TypeGraphQL from "type-graphql";
import { Expert_data_expertise_tags_expertise_tag } from "../../../models/Expert_data_expertise_tags_expertise_tag";
import { Expertise_tag } from "../../../models/Expertise_tag";
import { Expertise_tagExpert_data_expertise_tags_expertise_tagArgs } from "./args/Expertise_tagExpert_data_expertise_tags_expertise_tagArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expertise_tag)
export class Expertise_tagRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => [Expert_data_expertise_tags_expertise_tag], {
    nullable: false
  })
  async expert_data_expertise_tags_expertise_tag(@TypeGraphQL.Root() expertise_tag: Expertise_tag, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: Expertise_tagExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag[]> {
    return getPrismaFromContext(ctx).expertise_tag.findUnique({
      where: {
        id: expertise_tag.id,
      },
    }).expert_data_expertise_tags_expertise_tag(args);
  }
}
