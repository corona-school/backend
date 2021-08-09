import * as TypeGraphQL from "type-graphql";
import { Project_match } from "../../../models/Project_match";
import { Pupil } from "../../../models/Pupil";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_match)
export class Project_matchRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Pupil, {
    nullable: true
  })
  async pupil(@TypeGraphQL.Root() project_match: Project_match, @TypeGraphQL.Ctx() ctx: any): Promise<Pupil | null> {
    return getPrismaFromContext(ctx).project_match.findUnique({
      where: {
        id: project_match.id,
      },
    }).pupil({});
  }

  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() project_match: Project_match, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).project_match.findUnique({
      where: {
        id: project_match.id,
      },
    }).student({});
  }
}
