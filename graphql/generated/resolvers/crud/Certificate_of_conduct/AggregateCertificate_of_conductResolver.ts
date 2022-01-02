import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCertificate_of_conductArgs } from "./args/AggregateCertificate_of_conductArgs";
import { Certificate_of_conduct } from "../../../models/Certificate_of_conduct";
import { AggregateCertificate_of_conduct } from "../../outputs/AggregateCertificate_of_conduct";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Certificate_of_conduct)
export class AggregateCertificate_of_conductResolver {
  @TypeGraphQL.Query(_returns => AggregateCertificate_of_conduct, {
    nullable: false
  })
  async aggregateCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCertificate_of_conductArgs): Promise<AggregateCertificate_of_conduct> {
    return getPrismaFromContext(ctx).certificate_of_conduct.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
