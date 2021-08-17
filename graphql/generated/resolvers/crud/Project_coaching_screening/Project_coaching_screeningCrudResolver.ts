import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateProject_coaching_screeningArgs } from "./args/AggregateProject_coaching_screeningArgs";
import { CreateManyProject_coaching_screeningArgs } from "./args/CreateManyProject_coaching_screeningArgs";
import { CreateProject_coaching_screeningArgs } from "./args/CreateProject_coaching_screeningArgs";
import { DeleteManyProject_coaching_screeningArgs } from "./args/DeleteManyProject_coaching_screeningArgs";
import { DeleteProject_coaching_screeningArgs } from "./args/DeleteProject_coaching_screeningArgs";
import { FindFirstProject_coaching_screeningArgs } from "./args/FindFirstProject_coaching_screeningArgs";
import { FindManyProject_coaching_screeningArgs } from "./args/FindManyProject_coaching_screeningArgs";
import { FindUniqueProject_coaching_screeningArgs } from "./args/FindUniqueProject_coaching_screeningArgs";
import { GroupByProject_coaching_screeningArgs } from "./args/GroupByProject_coaching_screeningArgs";
import { UpdateManyProject_coaching_screeningArgs } from "./args/UpdateManyProject_coaching_screeningArgs";
import { UpdateProject_coaching_screeningArgs } from "./args/UpdateProject_coaching_screeningArgs";
import { UpsertProject_coaching_screeningArgs } from "./args/UpsertProject_coaching_screeningArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Project_coaching_screening } from "../../../models/Project_coaching_screening";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateProject_coaching_screening } from "../../outputs/AggregateProject_coaching_screening";
import { Project_coaching_screeningGroupBy } from "../../outputs/Project_coaching_screeningGroupBy";

@TypeGraphQL.Resolver(_of => Project_coaching_screening)
export class Project_coaching_screeningCrudResolver {
  @TypeGraphQL.Query(_returns => Project_coaching_screening, {
    nullable: true
  })
  async project_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueProject_coaching_screeningArgs): Promise<Project_coaching_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Project_coaching_screening, {
    nullable: true
  })
  async findFirstProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstProject_coaching_screeningArgs): Promise<Project_coaching_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Project_coaching_screening], {
    nullable: false
  })
  async project_coaching_screenings(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyProject_coaching_screeningArgs): Promise<Project_coaching_screening[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Project_coaching_screening, {
    nullable: false
  })
  async createProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateProject_coaching_screeningArgs): Promise<Project_coaching_screening> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyProject_coaching_screeningArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Project_coaching_screening, {
    nullable: true
  })
  async deleteProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteProject_coaching_screeningArgs): Promise<Project_coaching_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Project_coaching_screening, {
    nullable: true
  })
  async updateProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateProject_coaching_screeningArgs): Promise<Project_coaching_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyProject_coaching_screeningArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyProject_coaching_screeningArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Project_coaching_screening, {
    nullable: false
  })
  async upsertProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertProject_coaching_screeningArgs): Promise<Project_coaching_screening> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateProject_coaching_screening, {
    nullable: false
  })
  async aggregateProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateProject_coaching_screeningArgs): Promise<AggregateProject_coaching_screening> {
    return getPrismaFromContext(ctx).project_coaching_screening.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Project_coaching_screeningGroupBy], {
    nullable: false
  })
  async groupByProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByProject_coaching_screeningArgs): Promise<Project_coaching_screeningGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
