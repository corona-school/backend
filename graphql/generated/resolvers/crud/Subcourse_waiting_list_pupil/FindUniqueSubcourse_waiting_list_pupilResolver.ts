import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindUniqueSubcourse_waiting_list_pupilArgs } from "./args/FindUniqueSubcourse_waiting_list_pupilArgs";
import { Subcourse_waiting_list_pupil } from "../../../models/Subcourse_waiting_list_pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_waiting_list_pupil)
export class FindUniqueSubcourse_waiting_list_pupilResolver {
  @TypeGraphQL.Query(_returns => Subcourse_waiting_list_pupil, {
    nullable: true
  })
  async subcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueSubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
