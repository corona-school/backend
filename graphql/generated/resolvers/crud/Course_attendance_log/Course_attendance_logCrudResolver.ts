import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourse_attendance_logArgs } from "./args/AggregateCourse_attendance_logArgs";
import { CreateCourse_attendance_logArgs } from "./args/CreateCourse_attendance_logArgs";
import { CreateManyCourse_attendance_logArgs } from "./args/CreateManyCourse_attendance_logArgs";
import { DeleteCourse_attendance_logArgs } from "./args/DeleteCourse_attendance_logArgs";
import { DeleteManyCourse_attendance_logArgs } from "./args/DeleteManyCourse_attendance_logArgs";
import { FindFirstCourse_attendance_logArgs } from "./args/FindFirstCourse_attendance_logArgs";
import { FindManyCourse_attendance_logArgs } from "./args/FindManyCourse_attendance_logArgs";
import { FindUniqueCourse_attendance_logArgs } from "./args/FindUniqueCourse_attendance_logArgs";
import { GroupByCourse_attendance_logArgs } from "./args/GroupByCourse_attendance_logArgs";
import { UpdateCourse_attendance_logArgs } from "./args/UpdateCourse_attendance_logArgs";
import { UpdateManyCourse_attendance_logArgs } from "./args/UpdateManyCourse_attendance_logArgs";
import { UpsertCourse_attendance_logArgs } from "./args/UpsertCourse_attendance_logArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Course_attendance_log } from "../../../models/Course_attendance_log";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateCourse_attendance_log } from "../../outputs/AggregateCourse_attendance_log";
import { Course_attendance_logGroupBy } from "../../outputs/Course_attendance_logGroupBy";

@TypeGraphQL.Resolver(_of => Course_attendance_log)
export class Course_attendance_logCrudResolver {
  @TypeGraphQL.Query(_returns => Course_attendance_log, {
    nullable: true
  })
  async course_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueCourse_attendance_logArgs): Promise<Course_attendance_log | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Course_attendance_log, {
    nullable: true
  })
  async findFirstCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstCourse_attendance_logArgs): Promise<Course_attendance_log | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Course_attendance_log], {
    nullable: false
  })
  async course_attendance_logs(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyCourse_attendance_logArgs): Promise<Course_attendance_log[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_attendance_log, {
    nullable: false
  })
  async createCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateCourse_attendance_logArgs): Promise<Course_attendance_log> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyCourse_attendance_logArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_attendance_log, {
    nullable: true
  })
  async deleteCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteCourse_attendance_logArgs): Promise<Course_attendance_log | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_attendance_log, {
    nullable: true
  })
  async updateCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateCourse_attendance_logArgs): Promise<Course_attendance_log | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyCourse_attendance_logArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyCourse_attendance_logArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_attendance_log, {
    nullable: false
  })
  async upsertCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertCourse_attendance_logArgs): Promise<Course_attendance_log> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateCourse_attendance_log, {
    nullable: false
  })
  async aggregateCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourse_attendance_logArgs): Promise<AggregateCourse_attendance_log> {
    return getPrismaFromContext(ctx).course_attendance_log.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Course_attendance_logGroupBy], {
    nullable: false
  })
  async groupByCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByCourse_attendance_logArgs): Promise<Course_attendance_logGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
