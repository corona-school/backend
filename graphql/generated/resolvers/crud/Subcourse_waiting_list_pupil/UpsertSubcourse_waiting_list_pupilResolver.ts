import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertSubcourse_waiting_list_pupilArgs } from "./args/UpsertSubcourse_waiting_list_pupilArgs";
import { Subcourse_waiting_list_pupil } from "../../../models/Subcourse_waiting_list_pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_waiting_list_pupil)
export class UpsertSubcourse_waiting_list_pupilResolver {
  @TypeGraphQL.Mutation(_returns => Subcourse_waiting_list_pupil, {
    nullable: false
  })
  async upsertSubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
