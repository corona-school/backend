import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { CreateExpertise_tagArgs } from "./args/CreateExpertise_tagArgs";
import { Expertise_tag } from "../../../models/Expertise_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expertise_tag)
export class CreateExpertise_tagResolver {
  @TypeGraphQL.Mutation(_returns => Expertise_tag, {
    nullable: false
  })
  async createExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateExpertise_tagArgs): Promise<Expertise_tag> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
