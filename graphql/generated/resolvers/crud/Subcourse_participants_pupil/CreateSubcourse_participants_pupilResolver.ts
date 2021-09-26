import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { CreateSubcourse_participants_pupilArgs } from "./args/CreateSubcourse_participants_pupilArgs";
import { Subcourse_participants_pupil } from "../../../models/Subcourse_participants_pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_participants_pupil)
export class CreateSubcourse_participants_pupilResolver {
  @TypeGraphQL.Mutation(_returns => Subcourse_participants_pupil, {
    nullable: false
  })
  async createSubcourse_participants_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateSubcourse_participants_pupilArgs): Promise<Subcourse_participants_pupil> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_participants_pupil.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
