import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpdateSubcourse_instructors_studentArgs } from "./args/UpdateSubcourse_instructors_studentArgs";
import { Subcourse_instructors_student } from "../../../models/Subcourse_instructors_student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_instructors_student)
export class UpdateSubcourse_instructors_studentResolver {
  @TypeGraphQL.Mutation(_returns => Subcourse_instructors_student, {
    nullable: true
  })
  async updateSubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.update({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
