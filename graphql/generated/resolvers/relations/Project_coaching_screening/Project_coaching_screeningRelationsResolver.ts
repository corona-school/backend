import * as TypeGraphQL from "type-graphql";
import { Project_coaching_screening } from "../../../models/Project_coaching_screening";
import { Screener } from "../../../models/Screener";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_coaching_screening)
export class Project_coaching_screeningRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Screener, {
    nullable: true
  })
  async screener(@TypeGraphQL.Root() project_coaching_screening: Project_coaching_screening, @TypeGraphQL.Ctx() ctx: any): Promise<Screener | null> {
    return getPrismaFromContext(ctx).project_coaching_screening.findUnique({
      where: {
        id: project_coaching_screening.id,
      },
    }).screener({});
  }

  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() project_coaching_screening: Project_coaching_screening, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).project_coaching_screening.findUnique({
      where: {
        id: project_coaching_screening.id,
      },
    }).student({});
  }
}
