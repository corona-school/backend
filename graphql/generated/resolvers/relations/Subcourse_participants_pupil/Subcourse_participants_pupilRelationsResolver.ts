import * as TypeGraphQL from "type-graphql";
import { Pupil } from "../../../models/Pupil";
import { Subcourse } from "../../../models/Subcourse";
import { Subcourse_participants_pupil } from "../../../models/Subcourse_participants_pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_participants_pupil)
export class Subcourse_participants_pupilRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Pupil, {
    nullable: false
  })
  async pupil(@TypeGraphQL.Root() subcourse_participants_pupil: Subcourse_participants_pupil, @TypeGraphQL.Ctx() ctx: any): Promise<Pupil> {
    return getPrismaFromContext(ctx).subcourse_participants_pupil.findUnique({
      where: {
        subcourseId_pupilId: {
          subcourseId: subcourse_participants_pupil.subcourseId,
          pupilId: subcourse_participants_pupil.pupilId,
        },
      },
    }).pupil({});
  }

  @TypeGraphQL.FieldResolver(_type => Subcourse, {
    nullable: false
  })
  async subcourse(@TypeGraphQL.Root() subcourse_participants_pupil: Subcourse_participants_pupil, @TypeGraphQL.Ctx() ctx: any): Promise<Subcourse> {
    return getPrismaFromContext(ctx).subcourse_participants_pupil.findUnique({
      where: {
        subcourseId_pupilId: {
          subcourseId: subcourse_participants_pupil.subcourseId,
          pupilId: subcourse_participants_pupil.pupilId,
        },
      },
    }).subcourse({});
  }
}
