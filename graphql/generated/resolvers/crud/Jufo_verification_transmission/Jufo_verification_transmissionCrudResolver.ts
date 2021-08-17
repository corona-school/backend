import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateJufo_verification_transmissionArgs } from "./args/AggregateJufo_verification_transmissionArgs";
import { CreateJufo_verification_transmissionArgs } from "./args/CreateJufo_verification_transmissionArgs";
import { CreateManyJufo_verification_transmissionArgs } from "./args/CreateManyJufo_verification_transmissionArgs";
import { DeleteJufo_verification_transmissionArgs } from "./args/DeleteJufo_verification_transmissionArgs";
import { DeleteManyJufo_verification_transmissionArgs } from "./args/DeleteManyJufo_verification_transmissionArgs";
import { FindFirstJufo_verification_transmissionArgs } from "./args/FindFirstJufo_verification_transmissionArgs";
import { FindManyJufo_verification_transmissionArgs } from "./args/FindManyJufo_verification_transmissionArgs";
import { FindUniqueJufo_verification_transmissionArgs } from "./args/FindUniqueJufo_verification_transmissionArgs";
import { GroupByJufo_verification_transmissionArgs } from "./args/GroupByJufo_verification_transmissionArgs";
import { UpdateJufo_verification_transmissionArgs } from "./args/UpdateJufo_verification_transmissionArgs";
import { UpdateManyJufo_verification_transmissionArgs } from "./args/UpdateManyJufo_verification_transmissionArgs";
import { UpsertJufo_verification_transmissionArgs } from "./args/UpsertJufo_verification_transmissionArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Jufo_verification_transmission } from "../../../models/Jufo_verification_transmission";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateJufo_verification_transmission } from "../../outputs/AggregateJufo_verification_transmission";
import { Jufo_verification_transmissionGroupBy } from "../../outputs/Jufo_verification_transmissionGroupBy";

@TypeGraphQL.Resolver(_of => Jufo_verification_transmission)
export class Jufo_verification_transmissionCrudResolver {
  @TypeGraphQL.Query(_returns => Jufo_verification_transmission, {
    nullable: true
  })
  async jufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueJufo_verification_transmissionArgs): Promise<Jufo_verification_transmission | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Jufo_verification_transmission, {
    nullable: true
  })
  async findFirstJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstJufo_verification_transmissionArgs): Promise<Jufo_verification_transmission | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

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

  @TypeGraphQL.Mutation(_returns => Jufo_verification_transmission, {
    nullable: false
  })
  async createJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateJufo_verification_transmissionArgs): Promise<Jufo_verification_transmission> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyJufo_verification_transmissionArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Jufo_verification_transmission, {
    nullable: true
  })
  async deleteJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteJufo_verification_transmissionArgs): Promise<Jufo_verification_transmission | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

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

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyJufo_verification_transmissionArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyJufo_verification_transmissionArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Jufo_verification_transmission, {
    nullable: false
  })
  async upsertJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertJufo_verification_transmissionArgs): Promise<Jufo_verification_transmission> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateJufo_verification_transmission, {
    nullable: false
  })
  async aggregateJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateJufo_verification_transmissionArgs): Promise<AggregateJufo_verification_transmission> {
    return getPrismaFromContext(ctx).jufo_verification_transmission.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Jufo_verification_transmissionGroupBy], {
    nullable: false
  })
  async groupByJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByJufo_verification_transmissionArgs): Promise<Jufo_verification_transmissionGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
