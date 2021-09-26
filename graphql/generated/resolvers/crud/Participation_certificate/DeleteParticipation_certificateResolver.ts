import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DeleteParticipation_certificateArgs } from "./args/DeleteParticipation_certificateArgs";
import { Participation_certificate } from "../../../models/Participation_certificate";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Participation_certificate)
export class DeleteParticipation_certificateResolver {
  @TypeGraphQL.Mutation(_returns => Participation_certificate, {
    nullable: true
  })
  async deleteParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteParticipation_certificateArgs): Promise<Participation_certificate | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
