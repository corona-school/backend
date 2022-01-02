import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCertificate_of_conductArgs } from "./args/AggregateCertificate_of_conductArgs";
import { CreateCertificate_of_conductArgs } from "./args/CreateCertificate_of_conductArgs";
import { CreateManyCertificate_of_conductArgs } from "./args/CreateManyCertificate_of_conductArgs";
import { DeleteCertificate_of_conductArgs } from "./args/DeleteCertificate_of_conductArgs";
import { DeleteManyCertificate_of_conductArgs } from "./args/DeleteManyCertificate_of_conductArgs";
import { FindFirstCertificate_of_conductArgs } from "./args/FindFirstCertificate_of_conductArgs";
import { FindManyCertificate_of_conductArgs } from "./args/FindManyCertificate_of_conductArgs";
import { FindUniqueCertificate_of_conductArgs } from "./args/FindUniqueCertificate_of_conductArgs";
import { GroupByCertificate_of_conductArgs } from "./args/GroupByCertificate_of_conductArgs";
import { UpdateCertificate_of_conductArgs } from "./args/UpdateCertificate_of_conductArgs";
import { UpdateManyCertificate_of_conductArgs } from "./args/UpdateManyCertificate_of_conductArgs";
import { UpsertCertificate_of_conductArgs } from "./args/UpsertCertificate_of_conductArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Certificate_of_conduct } from "../../../models/Certificate_of_conduct";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateCertificate_of_conduct } from "../../outputs/AggregateCertificate_of_conduct";
import { Certificate_of_conductGroupBy } from "../../outputs/Certificate_of_conductGroupBy";

@TypeGraphQL.Resolver(_of => Certificate_of_conduct)
export class Certificate_of_conductCrudResolver {
  @TypeGraphQL.Query(_returns => Certificate_of_conduct, {
    nullable: true
  })
  async certificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueCertificate_of_conductArgs): Promise<Certificate_of_conduct | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Certificate_of_conduct, {
    nullable: true
  })
  async findFirstCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstCertificate_of_conductArgs): Promise<Certificate_of_conduct | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Certificate_of_conduct], {
    nullable: false
  })
  async certificate_of_conducts(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyCertificate_of_conductArgs): Promise<Certificate_of_conduct[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Certificate_of_conduct, {
    nullable: false
  })
  async createCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateCertificate_of_conductArgs): Promise<Certificate_of_conduct> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyCertificate_of_conductArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

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

  @TypeGraphQL.Mutation(_returns => Certificate_of_conduct, {
    nullable: true
  })
  async updateCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateCertificate_of_conductArgs): Promise<Certificate_of_conduct | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyCertificate_of_conductArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyCertificate_of_conductArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Certificate_of_conduct, {
    nullable: false
  })
  async upsertCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertCertificate_of_conductArgs): Promise<Certificate_of_conduct> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateCertificate_of_conduct, {
    nullable: false
  })
  async aggregateCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCertificate_of_conductArgs): Promise<AggregateCertificate_of_conduct> {
    return getPrismaFromContext(ctx).certificate_of_conduct.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Certificate_of_conductGroupBy], {
    nullable: false
  })
  async groupByCertificate_of_conduct(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByCertificate_of_conductArgs): Promise<Certificate_of_conductGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).certificate_of_conduct.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
