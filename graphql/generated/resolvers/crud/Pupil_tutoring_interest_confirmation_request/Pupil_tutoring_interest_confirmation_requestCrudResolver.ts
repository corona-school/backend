import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregatePupil_tutoring_interest_confirmation_requestArgs } from "./args/AggregatePupil_tutoring_interest_confirmation_requestArgs";
import { CreateManyPupil_tutoring_interest_confirmation_requestArgs } from "./args/CreateManyPupil_tutoring_interest_confirmation_requestArgs";
import { CreatePupil_tutoring_interest_confirmation_requestArgs } from "./args/CreatePupil_tutoring_interest_confirmation_requestArgs";
import { DeleteManyPupil_tutoring_interest_confirmation_requestArgs } from "./args/DeleteManyPupil_tutoring_interest_confirmation_requestArgs";
import { DeletePupil_tutoring_interest_confirmation_requestArgs } from "./args/DeletePupil_tutoring_interest_confirmation_requestArgs";
import { FindFirstPupil_tutoring_interest_confirmation_requestArgs } from "./args/FindFirstPupil_tutoring_interest_confirmation_requestArgs";
import { FindManyPupil_tutoring_interest_confirmation_requestArgs } from "./args/FindManyPupil_tutoring_interest_confirmation_requestArgs";
import { FindUniquePupil_tutoring_interest_confirmation_requestArgs } from "./args/FindUniquePupil_tutoring_interest_confirmation_requestArgs";
import { GroupByPupil_tutoring_interest_confirmation_requestArgs } from "./args/GroupByPupil_tutoring_interest_confirmation_requestArgs";
import { UpdateManyPupil_tutoring_interest_confirmation_requestArgs } from "./args/UpdateManyPupil_tutoring_interest_confirmation_requestArgs";
import { UpdatePupil_tutoring_interest_confirmation_requestArgs } from "./args/UpdatePupil_tutoring_interest_confirmation_requestArgs";
import { UpsertPupil_tutoring_interest_confirmation_requestArgs } from "./args/UpsertPupil_tutoring_interest_confirmation_requestArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Pupil_tutoring_interest_confirmation_request } from "../../../models/Pupil_tutoring_interest_confirmation_request";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregatePupil_tutoring_interest_confirmation_request } from "../../outputs/AggregatePupil_tutoring_interest_confirmation_request";
import { Pupil_tutoring_interest_confirmation_requestGroupBy } from "../../outputs/Pupil_tutoring_interest_confirmation_requestGroupBy";

@TypeGraphQL.Resolver(_of => Pupil_tutoring_interest_confirmation_request)
export class Pupil_tutoring_interest_confirmation_requestCrudResolver {
  @TypeGraphQL.Query(_returns => Pupil_tutoring_interest_confirmation_request, {
    nullable: true
  })
  async pupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniquePupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_request | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Pupil_tutoring_interest_confirmation_request, {
    nullable: true
  })
  async findFirstPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstPupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_request | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Pupil_tutoring_interest_confirmation_request], {
    nullable: false
  })
  async pupil_tutoring_interest_confirmation_requests(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyPupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_request[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Pupil_tutoring_interest_confirmation_request, {
    nullable: false
  })
  async createPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreatePupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_request> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyPupil_tutoring_interest_confirmation_requestArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Pupil_tutoring_interest_confirmation_request, {
    nullable: true
  })
  async deletePupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeletePupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_request | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Pupil_tutoring_interest_confirmation_request, {
    nullable: true
  })
  async updatePupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdatePupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_request | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyPupil_tutoring_interest_confirmation_requestArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyPupil_tutoring_interest_confirmation_requestArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Pupil_tutoring_interest_confirmation_request, {
    nullable: false
  })
  async upsertPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertPupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_request> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregatePupil_tutoring_interest_confirmation_request, {
    nullable: false
  })
  async aggregatePupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregatePupil_tutoring_interest_confirmation_requestArgs): Promise<AggregatePupil_tutoring_interest_confirmation_request> {
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Pupil_tutoring_interest_confirmation_requestGroupBy], {
    nullable: false
  })
  async groupByPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByPupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_requestGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
