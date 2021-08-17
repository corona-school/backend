import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateProject_field_with_grade_restrictionArgs } from "./args/AggregateProject_field_with_grade_restrictionArgs";
import { CreateManyProject_field_with_grade_restrictionArgs } from "./args/CreateManyProject_field_with_grade_restrictionArgs";
import { CreateProject_field_with_grade_restrictionArgs } from "./args/CreateProject_field_with_grade_restrictionArgs";
import { DeleteManyProject_field_with_grade_restrictionArgs } from "./args/DeleteManyProject_field_with_grade_restrictionArgs";
import { DeleteProject_field_with_grade_restrictionArgs } from "./args/DeleteProject_field_with_grade_restrictionArgs";
import { FindFirstProject_field_with_grade_restrictionArgs } from "./args/FindFirstProject_field_with_grade_restrictionArgs";
import { FindManyProject_field_with_grade_restrictionArgs } from "./args/FindManyProject_field_with_grade_restrictionArgs";
import { FindUniqueProject_field_with_grade_restrictionArgs } from "./args/FindUniqueProject_field_with_grade_restrictionArgs";
import { GroupByProject_field_with_grade_restrictionArgs } from "./args/GroupByProject_field_with_grade_restrictionArgs";
import { UpdateManyProject_field_with_grade_restrictionArgs } from "./args/UpdateManyProject_field_with_grade_restrictionArgs";
import { UpdateProject_field_with_grade_restrictionArgs } from "./args/UpdateProject_field_with_grade_restrictionArgs";
import { UpsertProject_field_with_grade_restrictionArgs } from "./args/UpsertProject_field_with_grade_restrictionArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Project_field_with_grade_restriction } from "../../../models/Project_field_with_grade_restriction";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateProject_field_with_grade_restriction } from "../../outputs/AggregateProject_field_with_grade_restriction";
import { Project_field_with_grade_restrictionGroupBy } from "../../outputs/Project_field_with_grade_restrictionGroupBy";

@TypeGraphQL.Resolver(_of => Project_field_with_grade_restriction)
export class Project_field_with_grade_restrictionCrudResolver {
  @TypeGraphQL.Query(_returns => Project_field_with_grade_restriction, {
    nullable: true
  })
  async project_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Project_field_with_grade_restriction, {
    nullable: true
  })
  async findFirstProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Project_field_with_grade_restriction], {
    nullable: false
  })
  async project_field_with_grade_restrictions(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Project_field_with_grade_restriction, {
    nullable: false
  })
  async createProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyProject_field_with_grade_restrictionArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Project_field_with_grade_restriction, {
    nullable: true
  })
  async deleteProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Project_field_with_grade_restriction, {
    nullable: true
  })
  async updateProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyProject_field_with_grade_restrictionArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyProject_field_with_grade_restrictionArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Project_field_with_grade_restriction, {
    nullable: false
  })
  async upsertProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateProject_field_with_grade_restriction, {
    nullable: false
  })
  async aggregateProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateProject_field_with_grade_restrictionArgs): Promise<AggregateProject_field_with_grade_restriction> {
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Project_field_with_grade_restrictionGroupBy], {
    nullable: false
  })
  async groupByProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restrictionGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
