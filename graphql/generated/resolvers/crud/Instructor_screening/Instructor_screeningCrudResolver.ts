import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateInstructor_screeningArgs } from "./args/AggregateInstructor_screeningArgs";
import { CreateInstructor_screeningArgs } from "./args/CreateInstructor_screeningArgs";
import { CreateManyInstructor_screeningArgs } from "./args/CreateManyInstructor_screeningArgs";
import { DeleteInstructor_screeningArgs } from "./args/DeleteInstructor_screeningArgs";
import { DeleteManyInstructor_screeningArgs } from "./args/DeleteManyInstructor_screeningArgs";
import { FindFirstInstructor_screeningArgs } from "./args/FindFirstInstructor_screeningArgs";
import { FindManyInstructor_screeningArgs } from "./args/FindManyInstructor_screeningArgs";
import { FindUniqueInstructor_screeningArgs } from "./args/FindUniqueInstructor_screeningArgs";
import { GroupByInstructor_screeningArgs } from "./args/GroupByInstructor_screeningArgs";
import { UpdateInstructor_screeningArgs } from "./args/UpdateInstructor_screeningArgs";
import { UpdateManyInstructor_screeningArgs } from "./args/UpdateManyInstructor_screeningArgs";
import { UpsertInstructor_screeningArgs } from "./args/UpsertInstructor_screeningArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Instructor_screening } from "../../../models/Instructor_screening";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateInstructor_screening } from "../../outputs/AggregateInstructor_screening";
import { Instructor_screeningGroupBy } from "../../outputs/Instructor_screeningGroupBy";

@TypeGraphQL.Resolver(_of => Instructor_screening)
export class Instructor_screeningCrudResolver {
  @TypeGraphQL.Query(_returns => Instructor_screening, {
    nullable: true
  })
  async instructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueInstructor_screeningArgs): Promise<Instructor_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Instructor_screening, {
    nullable: true
  })
  async findFirstInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstInstructor_screeningArgs): Promise<Instructor_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Instructor_screening], {
    nullable: false
  })
  async instructor_screenings(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyInstructor_screeningArgs): Promise<Instructor_screening[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Instructor_screening, {
    nullable: false
  })
  async createInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateInstructor_screeningArgs): Promise<Instructor_screening> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyInstructor_screeningArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Instructor_screening, {
    nullable: true
  })
  async deleteInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteInstructor_screeningArgs): Promise<Instructor_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Instructor_screening, {
    nullable: true
  })
  async updateInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateInstructor_screeningArgs): Promise<Instructor_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyInstructor_screeningArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyInstructor_screeningArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Instructor_screening, {
    nullable: false
  })
  async upsertInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertInstructor_screeningArgs): Promise<Instructor_screening> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateInstructor_screening, {
    nullable: false
  })
  async aggregateInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateInstructor_screeningArgs): Promise<AggregateInstructor_screening> {
    return getPrismaFromContext(ctx).instructor_screening.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Instructor_screeningGroupBy], {
    nullable: false
  })
  async groupByInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByInstructor_screeningArgs): Promise<Instructor_screeningGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
