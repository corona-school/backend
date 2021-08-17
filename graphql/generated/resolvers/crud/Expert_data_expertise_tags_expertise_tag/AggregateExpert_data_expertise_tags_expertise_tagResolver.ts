import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateExpert_data_expertise_tags_expertise_tagArgs } from "./args/AggregateExpert_data_expertise_tags_expertise_tagArgs";
import { Expert_data_expertise_tags_expertise_tag } from "../../../models/Expert_data_expertise_tags_expertise_tag";
import { AggregateExpert_data_expertise_tags_expertise_tag } from "../../outputs/AggregateExpert_data_expertise_tags_expertise_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data_expertise_tags_expertise_tag)
export class AggregateExpert_data_expertise_tags_expertise_tagResolver {
  @TypeGraphQL.Query(_returns => AggregateExpert_data_expertise_tags_expertise_tag, {
    nullable: false
  })
  async aggregateExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateExpert_data_expertise_tags_expertise_tagArgs): Promise<AggregateExpert_data_expertise_tags_expertise_tag> {
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
