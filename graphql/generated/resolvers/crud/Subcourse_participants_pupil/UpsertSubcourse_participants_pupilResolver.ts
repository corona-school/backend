import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertSubcourse_participants_pupilArgs } from "./args/UpsertSubcourse_participants_pupilArgs";
import { Subcourse_participants_pupil } from "../../../models/Subcourse_participants_pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_participants_pupil)
export class UpsertSubcourse_participants_pupilResolver {
  @TypeGraphQL.Mutation(_returns => Subcourse_participants_pupil, {
    nullable: false
  })
  async upsertSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
