import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateExpert_data_expertise_tags_expertise_tagArgs } from "./args/AggregateExpert_data_expertise_tags_expertise_tagArgs";
import { CreateExpert_data_expertise_tags_expertise_tagArgs } from "./args/CreateExpert_data_expertise_tags_expertise_tagArgs";
import { CreateManyExpert_data_expertise_tags_expertise_tagArgs } from "./args/CreateManyExpert_data_expertise_tags_expertise_tagArgs";
import { DeleteExpert_data_expertise_tags_expertise_tagArgs } from "./args/DeleteExpert_data_expertise_tags_expertise_tagArgs";
import { DeleteManyExpert_data_expertise_tags_expertise_tagArgs } from "./args/DeleteManyExpert_data_expertise_tags_expertise_tagArgs";
import { FindFirstExpert_data_expertise_tags_expertise_tagArgs } from "./args/FindFirstExpert_data_expertise_tags_expertise_tagArgs";
import { FindManyExpert_data_expertise_tags_expertise_tagArgs } from "./args/FindManyExpert_data_expertise_tags_expertise_tagArgs";
import { FindUniqueExpert_data_expertise_tags_expertise_tagArgs } from "./args/FindUniqueExpert_data_expertise_tags_expertise_tagArgs";
import { GroupByExpert_data_expertise_tags_expertise_tagArgs } from "./args/GroupByExpert_data_expertise_tags_expertise_tagArgs";
import { UpdateExpert_data_expertise_tags_expertise_tagArgs } from "./args/UpdateExpert_data_expertise_tags_expertise_tagArgs";
import { UpdateManyExpert_data_expertise_tags_expertise_tagArgs } from "./args/UpdateManyExpert_data_expertise_tags_expertise_tagArgs";
import { UpsertExpert_data_expertise_tags_expertise_tagArgs } from "./args/UpsertExpert_data_expertise_tags_expertise_tagArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";
import { Expert_data_expertise_tags_expertise_tag } from "../../../models/Expert_data_expertise_tags_expertise_tag";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { AggregateExpert_data_expertise_tags_expertise_tag } from "../../outputs/AggregateExpert_data_expertise_tags_expertise_tag";
import { Expert_data_expertise_tags_expertise_tagGroupBy } from "../../outputs/Expert_data_expertise_tags_expertise_tagGroupBy";

@TypeGraphQL.Resolver(_of => Expert_data_expertise_tags_expertise_tag)
export class Expert_data_expertise_tags_expertise_tagCrudResolver {
  @TypeGraphQL.Query(_returns => Expert_data_expertise_tags_expertise_tag, {
    nullable: true
  })
  async expert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => Expert_data_expertise_tags_expertise_tag, {
    nullable: true
  })
  async findFirstExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => [Expert_data_expertise_tags_expertise_tag], {
    nullable: false
  })
  async expert_data_expertise_tags_expertise_tags(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Expert_data_expertise_tags_expertise_tag, {
    nullable: false
  })
  async createExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async createManyExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateManyExpert_data_expertise_tags_expertise_tagArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.createMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Expert_data_expertise_tags_expertise_tag, {
    nullable: true
  })
  async deleteExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Expert_data_expertise_tags_expertise_tag, {
    nullable: true
  })
  async updateExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async deleteManyExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteManyExpert_data_expertise_tags_expertise_tagArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.deleteMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyExpert_data_expertise_tags_expertise_tagArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Mutation(_returns => Expert_data_expertise_tags_expertise_tag, {
    nullable: false
  })
  async upsertExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tag> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }

  @TypeGraphQL.Query(_returns => AggregateExpert_data_expertise_tags_expertise_tag, {
    nullable: false
  })
  async aggregateExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateExpert_data_expertise_tags_expertise_tagArgs): Promise<AggregateExpert_data_expertise_tags_expertise_tag> {
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }

  @TypeGraphQL.Query(_returns => [Expert_data_expertise_tags_expertise_tagGroupBy], {
    nullable: false
  })
  async groupByExpert_data_expertise_tags_expertise_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByExpert_data_expertise_tags_expertise_tagArgs): Promise<Expert_data_expertise_tags_expertise_tagGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data_expertise_tags_expertise_tag.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
