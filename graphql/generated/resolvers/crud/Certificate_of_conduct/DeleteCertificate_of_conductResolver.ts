import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DeleteCertificate_of_conductArgs } from "./args/DeleteCertificate_of_conductArgs";
import { Certificate_of_conduct } from "../../../models/Certificate_of_conduct";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Certificate_of_conduct)
export class DeleteCertificate_of_conductResolver {
  @TypeGraphQL.Mutation(_returns => Certificate_of_conduct, {
    nullable: true
  })
  async deleteCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteCertificate_of_conductArgs): Promise<Certificate_of_conduct | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
