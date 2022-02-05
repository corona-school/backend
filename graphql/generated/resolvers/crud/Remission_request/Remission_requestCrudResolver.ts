import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateRemission_requestArgs } from "./args/AggregateRemission_requestArgs";
import { CreateManyRemission_requestArgs } from "./args/CreateManyRemission_requestArgs";
import { CreateRemission_requestArgs } from "./args/CreateRemission_requestArgs";
import { DeleteManyRemission_requestArgs } from "./args/DeleteManyRemission_requestArgs";
import { DeleteRemission_requestArgs } from "./args/DeleteRemission_requestArgs";
import { FindFirstRemission_requestArgs } from "./args/FindFirstRemission_requestArgs";
import { FindManyRemission_requestArgs } from "./args/FindManyRemission_requestArgs";
import { FindUniqueRemission_requestArgs } from "./args/FindUniqueRemission_requestArgs";
import { GroupByRemission_requestArgs } from "./args/GroupByRemission_requestArgs";
import { UpdateManyRemission_requestArgs } from "./args/UpdateManyRemission_requestArgs";
import { UpdateRemission_requestArgs } from "./args/UpdateRemission_requestArgs";
import { UpsertRemission_requestArgs } from "./args/UpsertRemission_requestArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Remission_request } from "../../../models/Remission_request";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateRemission_request } from "../../outputs/AggregateRemission_request";
import { Remission_requestGroupBy } from "../../outputs/Remission_requestGroupBy";

@TypeGraphQL.Resolver(_of => Remission_request)
export class Remission_requestCrudResolver {
  @TypeGraphQL.Query(_returns => Remission_request, {
    nullable: true
  })
  async remission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueRemission_requestArgs): Promise<Remission_request | null> {
    return getPrismaFromContext(ctx).remission_request.findUnique(args);
  }

  @TypeGraphQL.Query(_returns => Remission_request, {
    nullable: true
  })
  async findFirstRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstRemission_requestArgs): Promise<Remission_request | null> {
    return getPrismaFromContext(ctx).remission_request.findFirst(args);
  }

  @TypeGraphQL.Query(_returns => [Remission_request], {
    nullable: false
  })
  async remission_requests(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyRemission_requestArgs): Promise<Remission_request[]> {
    return getPrismaFromContext(ctx).remission_request.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Remission_request, {
    nullable: false
  })
  async createRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateRemission_requestArgs): Promise<Remission_request> {
    return getPrismaFromContext(ctx).remission_request.create(args);
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyRemission_requestArgs): Promise<AffectedRowsOutput> {
    return getPrismaFromContext(ctx).remission_request.createMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Remission_request, {
    nullable: true
  })
  async deleteRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteRemission_requestArgs): Promise<Remission_request | null> {
    return getPrismaFromContext(ctx).remission_request.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Remission_request, {
    nullable: true
  })
  async updateRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateRemission_requestArgs): Promise<Remission_request | null> {
    return getPrismaFromContext(ctx).remission_request.update(args);
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyRemission_requestArgs): Promise<AffectedRowsOutput> {
    return getPrismaFromContext(ctx).remission_request.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyRemission_requestArgs): Promise<AffectedRowsOutput> {
    return getPrismaFromContext(ctx).remission_request.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Remission_request, {
    nullable: false
  })
  async upsertRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertRemission_requestArgs): Promise<Remission_request> {
    return getPrismaFromContext(ctx).remission_request.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateRemission_request, {
    nullable: false
  })
  async aggregateRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateRemission_requestArgs): Promise<AggregateRemission_request> {
    return getPrismaFromContext(ctx).remission_request.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Remission_requestGroupBy], {
    nullable: false
  })
  async groupByRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByRemission_requestArgs): Promise<Remission_requestGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).remission_request.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
