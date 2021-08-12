import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourse_participation_certificateArgs } from "./args/AggregateCourse_participation_certificateArgs";
import { CreateCourse_participation_certificateArgs } from "./args/CreateCourse_participation_certificateArgs";
import { CreateManyCourse_participation_certificateArgs } from "./args/CreateManyCourse_participation_certificateArgs";
import { DeleteCourse_participation_certificateArgs } from "./args/DeleteCourse_participation_certificateArgs";
import { DeleteManyCourse_participation_certificateArgs } from "./args/DeleteManyCourse_participation_certificateArgs";
import { FindFirstCourse_participation_certificateArgs } from "./args/FindFirstCourse_participation_certificateArgs";
import { FindManyCourse_participation_certificateArgs } from "./args/FindManyCourse_participation_certificateArgs";
import { FindUniqueCourse_participation_certificateArgs } from "./args/FindUniqueCourse_participation_certificateArgs";
import { GroupByCourse_participation_certificateArgs } from "./args/GroupByCourse_participation_certificateArgs";
import { UpdateCourse_participation_certificateArgs } from "./args/UpdateCourse_participation_certificateArgs";
import { UpdateManyCourse_participation_certificateArgs } from "./args/UpdateManyCourse_participation_certificateArgs";
import { UpsertCourse_participation_certificateArgs } from "./args/UpsertCourse_participation_certificateArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Course_participation_certificate } from "../../../models/Course_participation_certificate";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateCourse_participation_certificate } from "../../outputs/AggregateCourse_participation_certificate";
import { Course_participation_certificateGroupBy } from "../../outputs/Course_participation_certificateGroupBy";

@TypeGraphQL.Resolver(_of => Course_participation_certificate)
export class Course_participation_certificateCrudResolver {
  @TypeGraphQL.Query(_returns => Course_participation_certificate, {
    nullable: true
  })
  async course_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueCourse_participation_certificateArgs): Promise<Course_participation_certificate | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Course_participation_certificate, {
    nullable: true
  })
  async findFirstCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstCourse_participation_certificateArgs): Promise<Course_participation_certificate | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Course_participation_certificate], {
    nullable: false
  })
  async course_participation_certificates(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyCourse_participation_certificateArgs): Promise<Course_participation_certificate[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_participation_certificate, {
    nullable: false
  })
  async createCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateCourse_participation_certificateArgs): Promise<Course_participation_certificate> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyCourse_participation_certificateArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_participation_certificate, {
    nullable: true
  })
  async deleteCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteCourse_participation_certificateArgs): Promise<Course_participation_certificate | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_participation_certificate, {
    nullable: true
  })
  async updateCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateCourse_participation_certificateArgs): Promise<Course_participation_certificate | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyCourse_participation_certificateArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyCourse_participation_certificateArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Course_participation_certificate, {
    nullable: false
  })
  async upsertCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertCourse_participation_certificateArgs): Promise<Course_participation_certificate> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateCourse_participation_certificate, {
    nullable: false
  })
  async aggregateCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourse_participation_certificateArgs): Promise<AggregateCourse_participation_certificate> {
    return getPrismaFromContext(ctx).course_participation_certificate.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Course_participation_certificateGroupBy], {
    nullable: false
  })
  async groupByCourse_participation_certificate(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByCourse_participation_certificateArgs): Promise<Course_participation_certificateGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_participation_certificate.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
