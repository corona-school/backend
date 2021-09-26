import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindManyParticipation_certificateArgs } from "./args/FindManyParticipation_certificateArgs";
import { Participation_certificate } from "../../../models/Participation_certificate";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Participation_certificate)
export class FindManyParticipation_certificateResolver {
  @TypeGraphQL.Query(_returns => [Participation_certificate], {
    nullable: false
  })
  async participation_certificates(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyParticipation_certificateArgs): Promise<Participation_certificate[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
