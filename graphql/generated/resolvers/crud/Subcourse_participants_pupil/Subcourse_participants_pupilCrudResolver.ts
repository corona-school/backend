import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateSubcourse_participants_pupilArgs } from "./args/AggregateSubcourse_participants_pupilArgs";
import { CreateManySubcourse_participants_pupilArgs } from "./args/CreateManySubcourse_participants_pupilArgs";
import { CreateSubcourse_participants_pupilArgs } from "./args/CreateSubcourse_participants_pupilArgs";
import { DeleteManySubcourse_participants_pupilArgs } from "./args/DeleteManySubcourse_participants_pupilArgs";
import { DeleteSubcourse_participants_pupilArgs } from "./args/DeleteSubcourse_participants_pupilArgs";
import { FindFirstSubcourse_participants_pupilArgs } from "./args/FindFirstSubcourse_participants_pupilArgs";
import { FindManySubcourse_participants_pupilArgs } from "./args/FindManySubcourse_participants_pupilArgs";
import { FindUniqueSubcourse_participants_pupilArgs } from "./args/FindUniqueSubcourse_participants_pupilArgs";
import { GroupBySubcourse_participants_pupilArgs } from "./args/GroupBySubcourse_participants_pupilArgs";
import { UpdateManySubcourse_participants_pupilArgs } from "./args/UpdateManySubcourse_participants_pupilArgs";
import { UpdateSubcourse_participants_pupilArgs } from "./args/UpdateSubcourse_participants_pupilArgs";
import { UpsertSubcourse_participants_pupilArgs } from "./args/UpsertSubcourse_participants_pupilArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Subcourse_participants_pupil } from "../../../models/Subcourse_participants_pupil";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateSubcourse_participants_pupil } from "../../outputs/AggregateSubcourse_participants_pupil";
import { Subcourse_participants_pupilGroupBy } from "../../outputs/Subcourse_participants_pupilGroupBy";

@TypeGraphQL.Resolver(_of => Subcourse_participants_pupil)
export class Subcourse_participants_pupilCrudResolver {
  @TypeGraphQL.Query(_returns => Subcourse_participants_pupil, {
    nullable: true
  })
  async subcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Subcourse_participants_pupil, {
    nullable: true
  })
  async findFirstSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Subcourse_participants_pupil], {
    nullable: false
  })
  async subcourse_participants_pupils(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManySubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_participants_pupil, {
    nullable: false
  })
  async createSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManySubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManySubcourse_participants_pupilArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_participants_pupil, {
    nullable: true
  })
  async deleteSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_participants_pupil, {
    nullable: true
  })
  async updateSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManySubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManySubcourse_participants_pupilArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManySubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManySubcourse_participants_pupilArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_participants_pupil, {
    nullable: false
  })
  async upsertSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateSubcourse_participants_pupil, {
    nullable: false
  })
  async aggregateSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateSubcourse_participants_pupilArgs): Promise<AggregateSubcourse_participants_pupil> {
    return getPrismaFromContext(ctx).subcourse_participants_pupil.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Subcourse_participants_pupilGroupBy], {
    nullable: false
  })
  async groupBySubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupBySubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupilGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
