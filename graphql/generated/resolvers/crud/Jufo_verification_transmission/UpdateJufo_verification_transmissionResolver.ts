import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpdateJufo_verification_transmissionArgs } from "./args/UpdateJufo_verification_transmissionArgs";
import { Jufo_verification_transmission } from "../../../models/Jufo_verification_transmission";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Jufo_verification_transmission)
export class UpdateJufo_verification_transmissionResolver {
  @TypeGraphQL.Mutation(_returns => Jufo_verification_transmission, {
    nullable: true
  })
  async updateJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateJufo_verification_transmissionArgs): Promise<Jufo_verification_transmission | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
