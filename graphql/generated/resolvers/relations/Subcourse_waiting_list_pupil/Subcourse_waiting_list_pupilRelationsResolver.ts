import * as TypeGraphQL from "type-graphql";
import { Pupil } from "../../../models/Pupil";
import { Subcourse } from "../../../models/Subcourse";
import { Subcourse_waiting_list_pupil } from "../../../models/Subcourse_waiting_list_pupil";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_waiting_list_pupil)
export class Subcourse_waiting_list_pupilRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Pupil, {
    nullable: false
  })
  async pupil(@TypeGraphQL.Root() subcourse_waiting_list_pupil: Subcourse_waiting_list_pupil, @TypeGraphQL.Ctx() ctx: any): Promise<Pupil> {
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.findUnique({
      where: {
        subcourseId_pupilId: {
          subcourseId: subcourse_waiting_list_pupil.subcourseId,
          pupilId: subcourse_waiting_list_pupil.pupilId,
        },
      },
    }).pupil({});
  }

  @TypeGraphQL.FieldResolver(_type => Subcourse, {
    nullable: false
  })
  async subcourse(@TypeGraphQL.Root() subcourse_waiting_list_pupil: Subcourse_waiting_list_pupil, @TypeGraphQL.Ctx() ctx: any): Promise<Subcourse> {
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.findUnique({
      where: {
        subcourseId_pupilId: {
          subcourseId: subcourse_waiting_list_pupil.subcourseId,
          pupilId: subcourse_waiting_list_pupil.pupilId,
        },
      },
    }).subcourse({});
  }
}
