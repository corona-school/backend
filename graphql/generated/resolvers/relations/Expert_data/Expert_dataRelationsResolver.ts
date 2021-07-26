import * as TypeGraphQL from "type-graphql";
import { Expert_data } from "../../../models/Expert_data";
import { Expert_data_expertise_tags_expertise_tag } from "../../../models/Expert_data_expertise_tags_expertise_tag";
import { Student } from "../../../models/Student";
import { Expert_dataExpert_data_expertise_tags_expertise_tagArgs } from "./args/Expert_dataExpert_data_expertise_tags_expertise_tagArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data)
export class Expert_dataRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() expert_data: Expert_data, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).expert_data.findUnique({
      where: {
        id: expert_data.id,
      },
    }).student({});
  }

  @TypeGraphQL.FieldResolver(_type => [Expert_data_expertise_tags_expertise_tag], {
    nullable: false
  })
  async expert_data_expertise_tags_expertise_tag(@TypeGraphQL.Root() expert_data: Expert_data, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: Expert_dataExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag[]> {
    return getPrismaFromContext(ctx).expert_data.findUnique({
      where: {
        id: expert_data.id,
      },
    }).expert_data_expertise_tags_expertise_tag(args);
  }
}
