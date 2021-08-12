import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateParticipation_certificateArgs } from "./args/AggregateParticipation_certificateArgs";
import { CreateManyParticipation_certificateArgs } from "./args/CreateManyParticipation_certificateArgs";
import { CreateParticipation_certificateArgs } from "./args/CreateParticipation_certificateArgs";
import { DeleteManyParticipation_certificateArgs } from "./args/DeleteManyParticipation_certificateArgs";
import { DeleteParticipation_certificateArgs } from "./args/DeleteParticipation_certificateArgs";
import { FindFirstParticipation_certificateArgs } from "./args/FindFirstParticipation_certificateArgs";
import { FindManyParticipation_certificateArgs } from "./args/FindManyParticipation_certificateArgs";
import { FindUniqueParticipation_certificateArgs } from "./args/FindUniqueParticipation_certificateArgs";
import { GroupByParticipation_certificateArgs } from "./args/GroupByParticipation_certificateArgs";
import { UpdateManyParticipation_certificateArgs } from "./args/UpdateManyParticipation_certificateArgs";
import { UpdateParticipation_certificateArgs } from "./args/UpdateParticipation_certificateArgs";
import { UpsertParticipation_certificateArgs } from "./args/UpsertParticipation_certificateArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Participation_certificate } from "../../../models/Participation_certificate";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateParticipation_certificate } from "../../outputs/AggregateParticipation_certificate";
import { Participation_certificateGroupBy } from "../../outputs/Participation_certificateGroupBy";

@TypeGraphQL.Resolver(_of => Participation_certificate)
export class Participation_certificateCrudResolver {
  @TypeGraphQL.Query(_returns => Participation_certificate, {
    nullable: true
  })
  async participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueParticipation_certificateArgs): Promise<Participation_certificate | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Participation_certificate, {
    nullable: true
  })
  async findFirstParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstParticipation_certificateArgs): Promise<Participation_certificate | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

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

  @TypeGraphQL.Mutation(_returns => Participation_certificate, {
    nullable: false
  })
  async createParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateParticipation_certificateArgs): Promise<Participation_certificate> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyParticipation_certificateArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

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

  @TypeGraphQL.Mutation(_returns => Participation_certificate, {
    nullable: true
  })
  async updateParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateParticipation_certificateArgs): Promise<Participation_certificate | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyParticipation_certificateArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyParticipation_certificateArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Participation_certificate, {
    nullable: false
  })
  async upsertParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertParticipation_certificateArgs): Promise<Participation_certificate> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateParticipation_certificate, {
    nullable: false
  })
  async aggregateParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateParticipation_certificateArgs): Promise<AggregateParticipation_certificate> {
    return getPrismaFromContext(ctx).participation_certificate.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Participation_certificateGroupBy], {
    nullable: false
  })
  async groupByParticipation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByParticipation_certificateArgs): Promise<Participation_certificateGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).participation_certificate.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
