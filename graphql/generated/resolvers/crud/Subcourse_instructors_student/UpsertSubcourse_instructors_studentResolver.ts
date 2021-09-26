import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertSubcourse_instructors_studentArgs } from "./args/UpsertSubcourse_instructors_studentArgs";
import { Subcourse_instructors_student } from "../../../models/Subcourse_instructors_student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_instructors_student)
export class UpsertSubcourse_instructors_studentResolver {
  @TypeGraphQL.Mutation(_returns => Subcourse_instructors_student, {
    nullable: false
  })
  async upsertSubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertSubcourse_instructors_studentArgs): Promise<Subcourse_instructors_student> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_instructors_student.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
