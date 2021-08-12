import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateExpertise_tagArgs } from "./args/AggregateExpertise_tagArgs";
import { CreateExpertise_tagArgs } from "./args/CreateExpertise_tagArgs";
import { CreateManyExpertise_tagArgs } from "./args/CreateManyExpertise_tagArgs";
import { DeleteExpertise_tagArgs } from "./args/DeleteExpertise_tagArgs";
import { DeleteManyExpertise_tagArgs } from "./args/DeleteManyExpertise_tagArgs";
import { FindFirstExpertise_tagArgs } from "./args/FindFirstExpertise_tagArgs";
import { FindManyExpertise_tagArgs } from "./args/FindManyExpertise_tagArgs";
import { FindUniqueExpertise_tagArgs } from "./args/FindUniqueExpertise_tagArgs";
import { GroupByExpertise_tagArgs } from "./args/GroupByExpertise_tagArgs";
import { UpdateExpertise_tagArgs } from "./args/UpdateExpertise_tagArgs";
import { UpdateManyExpertise_tagArgs } from "./args/UpdateManyExpertise_tagArgs";
import { UpsertExpertise_tagArgs } from "./args/UpsertExpertise_tagArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Expertise_tag } from "../../../models/Expertise_tag";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateExpertise_tag } from "../../outputs/AggregateExpertise_tag";
import { Expertise_tagGroupBy } from "../../outputs/Expertise_tagGroupBy";

@TypeGraphQL.Resolver(_of => Expertise_tag)
export class Expertise_tagCrudResolver {
  @TypeGraphQL.Query(_returns => Expertise_tag, {
    nullable: true
  })
  async expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueExpertise_tagArgs): Promise<Expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Expertise_tag, {
    nullable: true
  })
  async findFirstExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstExpertise_tagArgs): Promise<Expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Expertise_tag], {
    nullable: false
  })
  async expertise_tags(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyExpertise_tagArgs): Promise<Expertise_tag[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Expertise_tag, {
    nullable: false
  })
  async createExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateExpertise_tagArgs): Promise<Expertise_tag> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyExpertise_tagArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Expertise_tag, {
    nullable: true
  })
  async deleteExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteExpertise_tagArgs): Promise<Expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Expertise_tag, {
    nullable: true
  })
  async updateExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateExpertise_tagArgs): Promise<Expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyExpertise_tagArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyExpertise_tagArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Expertise_tag, {
    nullable: false
  })
  async upsertExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertExpertise_tagArgs): Promise<Expertise_tag> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateExpertise_tag, {
    nullable: false
  })
  async aggregateExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateExpertise_tagArgs): Promise<AggregateExpertise_tag> {
    return getPrismaFromContext(ctx).expertise_tag.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Expertise_tagGroupBy], {
    nullable: false
  })
  async groupByExpertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByExpertise_tagArgs): Promise<Expertise_tagGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expertise_tag.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
