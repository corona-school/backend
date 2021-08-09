import * as TypeGraphQL from "type-graphql";
import { Project_field_with_grade_restriction } from "../../../models/Project_field_with_grade_restriction";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_field_with_grade_restriction)
export class Project_field_with_grade_restrictionRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: false
  })
  async student(@TypeGraphQL.Root() project_field_with_grade_restriction: Project_field_with_grade_restriction, @TypeGraphQL.Ctx() ctx: any): Promise<Student> {
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.findUnique({
      where: {
        id: project_field_with_grade_restriction.id,
      },
    }).student({});
  }
}
