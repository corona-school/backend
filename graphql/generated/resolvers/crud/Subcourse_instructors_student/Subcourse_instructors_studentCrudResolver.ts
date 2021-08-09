import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateSubcourse_instructors_studentArgs } from "./args/AggregateSubcourse_instructors_studentArgs";
import { CreateManySubcourse_instructors_studentArgs } from "./args/CreateManySubcourse_instructors_studentArgs";
import { CreateSubcourse_instructors_studentArgs } from "./args/CreateSubcourse_instructors_studentArgs";
import { DeleteManySubcourse_instructors_studentArgs } from "./args/DeleteManySubcourse_instructors_studentArgs";
import { DeleteSubcourse_instructors_studentArgs } from "./args/DeleteSubcourse_instructors_studentArgs";
import { FindFirstSubcourse_instructors_studentArgs } from "./args/FindFirstSubcourse_instructors_studentArgs";
import { FindManySubcourse_instructors_studentArgs } from "./args/FindManySubcourse_instructors_studentArgs";
import { FindUniqueSubcourse_instructors_studentArgs } from "./args/FindUniqueSubcourse_instructors_studentArgs";
import { GroupBySubcourse_instructors_studentArgs } from "./args/GroupBySubcourse_instructors_studentArgs";
import { UpdateManySubcourse_instructors_studentArgs } from "./args/UpdateManySubcourse_instructors_studentArgs";
import { UpdateSubcourse_instructors_studentArgs } from "./args/UpdateSubcourse_instructors_studentArgs";
import { UpsertSubcourse_instructors_studentArgs } from "./args/UpsertSubcourse_instructors_studentArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Subcourse_instructors_student } from "../../../models/Subcourse_instructors_student";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateSubcourse_instructors_student } from "../../outputs/AggregateSubcourse_instructors_student";
import { Subcourse_instructors_studentGroupBy } from "../../outputs/Subcourse_instructors_studentGroupBy";

@TypeGraphQL.Resolver(_of => Subcourse_instructors_student)
export class Subcourse_instructors_studentCrudResolver {
  @TypeGraphQL.Query(_returns => Subcourse_instructors_student, {
    nullable: true
  })
  async subcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Subcourse_instructors_student, {
    nullable: true
  })
  async findFirstSubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Subcourse_instructors_student], {
    nullable: false
  })
  async subcourse_instructors_students(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManySubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_instructors_student, {
    nullable: false
  })
  async createSubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManySubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManySubcourse_instructors_studentArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_instructors_student, {
    nullable: true
  })
  async deleteSubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_instructors_student, {
    nullable: true
  })
  async updateSubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManySubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManySubcourse_instructors_studentArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManySubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManySubcourse_instructors_studentArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Subcourse_instructors_student, {
    nullable: false
  })
  async upsertSubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateSubcourse_instructors_student, {
    nullable: false
  })
  async aggregateSubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateSubcourse_instructors_studentArgs): Promise<AggregateSubcourse_instructors_student> {
    return getPrismaFromContext(ctx).subcourse_instructors_student.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Subcourse_instructors_studentGroupBy], {
    nullable: false
  })
  async groupBySubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupBySubcourse_instructors_studentArgs): Promise<Subcourse_instructors_studentGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
