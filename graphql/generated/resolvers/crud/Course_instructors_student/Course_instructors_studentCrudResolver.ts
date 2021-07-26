import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourse_instructors_studentArgs } from "./args/AggregateCourse_instructors_studentArgs";
import { CreateCourse_instructors_studentArgs } from "./args/CreateCourse_instructors_studentArgs";
import { CreateManyCourse_instructors_studentArgs } from "./args/CreateManyCourse_instructors_studentArgs";
import { DeleteCourse_instructors_studentArgs } from "./args/DeleteCourse_instructors_studentArgs";
import { DeleteManyCourse_instructors_studentArgs } from "./args/DeleteManyCourse_instructors_studentArgs";
import { FindFirstCourse_instructors_studentArgs } from "./args/FindFirstCourse_instructors_studentArgs";
import { FindManyCourse_instructors_studentArgs } from "./args/FindManyCourse_instructors_studentArgs";
import { FindUniqueCourse_instructors_studentArgs } from "./args/FindUniqueCourse_instructors_studentArgs";
import { GroupByCourse_instructors_studentArgs } from "./args/GroupByCourse_instructors_studentArgs";
import { UpdateCourse_instructors_studentArgs } from "./args/UpdateCourse_instructors_studentArgs";
import { UpdateManyCourse_instructors_studentArgs } from "./args/UpdateManyCourse_instructors_studentArgs";
import { UpsertCourse_instructors_studentArgs } from "./args/UpsertCourse_instructors_studentArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Course_instructors_student } from "../../../models/Course_instructors_student";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateCourse_instructors_student } from "../../outputs/AggregateCourse_instructors_student";
import { Course_instructors_studentGroupBy } from "../../outputs/Course_instructors_studentGroupBy";

@TypeGraphQL.Resolver(_of => Course_instructors_student)
export class Course_instructors_studentCrudResolver {
  @TypeGraphQL.Query(_returns => Course_instructors_student, {
    nullable: true
  })
  async course_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueCourse_instructors_studentArgs): Promise<Course_instructors_student | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Course_instructors_student, {
    nullable: true
  })
  async findFirstCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstCourse_instructors_studentArgs): Promise<Course_instructors_student | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Course_instructors_student], {
    nullable: false
  })
  async course_instructors_students(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyCourse_instructors_studentArgs): Promise<Course_instructors_student[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_instructors_student, {
    nullable: false
  })
  async createCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateCourse_instructors_studentArgs): Promise<Course_instructors_student> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyCourse_instructors_studentArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_instructors_student, {
    nullable: true
  })
  async deleteCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteCourse_instructors_studentArgs): Promise<Course_instructors_student | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_instructors_student, {
    nullable: true
  })
  async updateCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateCourse_instructors_studentArgs): Promise<Course_instructors_student | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyCourse_instructors_studentArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyCourse_instructors_studentArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_instructors_student, {
    nullable: false
  })
  async upsertCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertCourse_instructors_studentArgs): Promise<Course_instructors_student> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateCourse_instructors_student, {
    nullable: false
  })
  async aggregateCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourse_instructors_studentArgs): Promise<AggregateCourse_instructors_student> {
    return getPrismaFromContext(ctx).course_instructors_student.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Course_instructors_studentGroupBy], {
    nullable: false
  })
  async groupByCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByCourse_instructors_studentArgs): Promise<Course_instructors_studentGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
