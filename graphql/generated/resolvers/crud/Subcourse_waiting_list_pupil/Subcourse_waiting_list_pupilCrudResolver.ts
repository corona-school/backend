import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateSubcourse_waiting_list_pupilArgs } from "./args/AggregateSubcourse_waiting_list_pupilArgs";
import { CreateManySubcourse_waiting_list_pupilArgs } from "./args/CreateManySubcourse_waiting_list_pupilArgs";
import { CreateSubcourse_waiting_list_pupilArgs } from "./args/CreateSubcourse_waiting_list_pupilArgs";
import { DeleteManySubcourse_waiting_list_pupilArgs } from "./args/DeleteManySubcourse_waiting_list_pupilArgs";
import { DeleteSubcourse_waiting_list_pupilArgs } from "./args/DeleteSubcourse_waiting_list_pupilArgs";
import { FindFirstSubcourse_waiting_list_pupilArgs } from "./args/FindFirstSubcourse_waiting_list_pupilArgs";
import { FindManySubcourse_waiting_list_pupilArgs } from "./args/FindManySubcourse_waiting_list_pupilArgs";
import { FindUniqueSubcourse_waiting_list_pupilArgs } from "./args/FindUniqueSubcourse_waiting_list_pupilArgs";
import { GroupBySubcourse_waiting_list_pupilArgs } from "./args/GroupBySubcourse_waiting_list_pupilArgs";
import { UpdateManySubcourse_waiting_list_pupilArgs } from "./args/UpdateManySubcourse_waiting_list_pupilArgs";
import { UpdateSubcourse_waiting_list_pupilArgs } from "./args/UpdateSubcourse_waiting_list_pupilArgs";
import { UpsertSubcourse_waiting_list_pupilArgs } from "./args/UpsertSubcourse_waiting_list_pupilArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Subcourse_waiting_list_pupil } from "../../../models/Subcourse_waiting_list_pupil";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateSubcourse_waiting_list_pupil } from "../../outputs/AggregateSubcourse_waiting_list_pupil";
import { Subcourse_waiting_list_pupilGroupBy } from "../../outputs/Subcourse_waiting_list_pupilGroupBy";

@TypeGraphQL.Resolver(_of => Subcourse_waiting_list_pupil)
export class Subcourse_waiting_list_pupilCrudResolver {
  @TypeGraphQL.Query(_returns => Subcourse_waiting_list_pupil, {
    nullable: true
  })
  async subcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Subcourse_waiting_list_pupil, {
    nullable: true
  })
  async findFirstSubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Subcourse_waiting_list_pupil], {
    nullable: false
  })
  async subcourse_waiting_list_pupils(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManySubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_waiting_list_pupil, {
    nullable: false
  })
  async createSubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManySubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManySubcourse_waiting_list_pupilArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_waiting_list_pupil, {
    nullable: true
  })
  async deleteSubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_waiting_list_pupil, {
    nullable: true
  })
  async updateSubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManySubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManySubcourse_waiting_list_pupilArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManySubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManySubcourse_waiting_list_pupilArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_waiting_list_pupil, {
    nullable: false
  })
  async upsertSubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateSubcourse_waiting_list_pupil, {
    nullable: false
  })
  async aggregateSubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateSubcourse_waiting_list_pupilArgs): Promise<AggregateSubcourse_waiting_list_pupil> {
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Subcourse_waiting_list_pupilGroupBy], {
    nullable: false
  })
  async groupBySubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupBySubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupilGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
