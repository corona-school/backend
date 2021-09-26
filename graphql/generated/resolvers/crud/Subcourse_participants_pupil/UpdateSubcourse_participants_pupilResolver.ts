import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpdateSubcourse_participants_pupilArgs } from "./args/UpdateSubcourse_participants_pupilArgs";
import { Subcourse_participants_pupil } from "../../../models/Subcourse_participants_pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_participants_pupil)
export class UpdateSubcourse_participants_pupilResolver {
  @TypeGraphQL.Mutation(_returns => Subcourse_participants_pupil, {
    nullable: true
  })
  async updateSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
