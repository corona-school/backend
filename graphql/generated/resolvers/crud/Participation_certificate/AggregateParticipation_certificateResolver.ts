import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateParticipation_certificateArgs } from "./args/AggregateParticipation_certificateArgs";
import { Participation_certificate } from "../../../models/Participation_certificate";
import { AggregateParticipation_certificate } from "../../outputs/AggregateParticipation_certificate";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Participation_certificate)
export class AggregateParticipation_certificateResolver {
  @TypeGraphQL.Query(_returns => AggregateParticipation_certificate, {
    nullable: false
  })
  async aggregateParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateParticipation_certificateArgs): Promise<AggregateParticipation_certificate> {
    return getPrismaFromContext(ctx).participation_certificate.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
