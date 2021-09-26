import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateJufo_verification_transmissionArgs } from "./args/AggregateJufo_verification_transmissionArgs";
import { Jufo_verification_transmission } from "../../../models/Jufo_verification_transmission";
import { AggregateJufo_verification_transmission } from "../../outputs/AggregateJufo_verification_transmission";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Jufo_verification_transmission)
export class AggregateJufo_verification_transmissionResolver {
  @TypeGraphQL.Query(_returns => AggregateJufo_verification_transmission, {
    nullable: false
  })
  async aggregateJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateJufo_verification_transmissionArgs): Promise<AggregateJufo_verification_transmission> {
    return getPrismaFromContext(ctx).jufo_verification_transmission.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
