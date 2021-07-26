import * as TypeGraphQL from "type-graphql";
import { Match } from "../../../models/Match";
import { Pupil } from "../../../models/Pupil";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Match)
export class MatchRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Pupil, {
    nullable: true
  })
  async pupil(@TypeGraphQL.Root() match: Match, @TypeGraphQL.Ctx() ctx: any): Promise<Pupil | null> {
    return getPrismaFromContext(ctx).match.findUnique({
      where: {
        id: match.id,
      },
    }).pupil({});
  }

  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() match: Match, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).match.findUnique({
      where: {
        id: match.id,
      },
    }).student({});
  }
}
