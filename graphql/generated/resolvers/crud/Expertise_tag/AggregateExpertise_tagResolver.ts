import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateExpertise_tagArgs } from "./args/AggregateExpertise_tagArgs";
import { Expertise_tag } from "../../../models/Expertise_tag";
import { AggregateExpertise_tag } from "../../outputs/AggregateExpertise_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expertise_tag)
export class AggregateExpertise_tagResolver {
  @TypeGraphQL.Query(_returns => AggregateExpertise_tag, {
    nullable: false
  })
  async aggregateExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateExpertise_tagArgs): Promise<AggregateExpertise_tag> {
    return getPrismaFromContext(ctx).expertise_tag.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
