import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindManyJufo_verification_transmissionArgs } from "./args/FindManyJufo_verification_transmissionArgs";
import { Jufo_verification_transmission } from "../../../models/Jufo_verification_transmission";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Jufo_verification_transmission)
export class FindManyJufo_verification_transmissionResolver {
  @TypeGraphQL.Query(_returns => [Jufo_verification_transmission], {
    nullable: false
  })
  async jufo_verification_transmissions(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyJufo_verification_transmissionArgs): Promise<Jufo_verification_transmission[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
