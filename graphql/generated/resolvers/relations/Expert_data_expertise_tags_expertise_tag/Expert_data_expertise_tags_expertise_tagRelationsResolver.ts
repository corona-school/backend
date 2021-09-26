import * as TypeGraphQL from "type-graphql";
import { Expert_data } from "../../../models/Expert_data";
import { Expert_data_expertise_tags_expertise_tag } from "../../../models/Expert_data_expertise_tags_expertise_tag";
import { Expertise_tag } from "../../../models/Expertise_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data_expertise_tags_expertise_tag)
export class Expert_data_expertise_tags_expertise_tagRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Expert_data, {
    nullable: false
  })
  async expert_data(@TypeGraphQL.Root() expert_data_expertise_tags_expertise_tag: Expert_data_expertise_tags_expertise_tag, @TypeGraphQL.Ctx() ctx: any): Promise<Expert_data> {
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.findUnique({
      where: {
        expertDataId_expertiseTagId: {
          expertDataId: expert_data_expertise_tags_expertise_tag.expertDataId,
          expertiseTagId: expert_data_expertise_tags_expertise_tag.expertiseTagId,
        },
      },
    }).expert_data({});
  }

  @TypeGraphQL.FieldResolver(_type => Expertise_tag, {
    nullable: false
  })
  async expertise_tag(@TypeGraphQL.Root() expert_data_expertise_tags_expertise_tag: Expert_data_expertise_tags_expertise_tag, @TypeGraphQL.Ctx() ctx: any): Promise<Expertise_tag> {
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.findUnique({
      where: {
        expertDataId_expertiseTagId: {
          expertDataId: expert_data_expertise_tags_expertise_tag.expertDataId,
          expertiseTagId: expert_data_expertise_tags_expertise_tag.expertiseTagId,
        },
      },
    }).expertise_tag({});
  }
}
