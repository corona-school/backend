import * as TypeGraphQL from "type-graphql";
import { Participation_certificate } from "../../../models/Participation_certificate";
import { Pupil } from "../../../models/Pupil";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Participation_certificate)
export class Participation_certificateRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Pupil, {
    nullable: true
  })
  async pupil(@TypeGraphQL.Root() participation_certificate: Participation_certificate, @TypeGraphQL.Ctx() ctx: any): Promise<Pupil | null> {
    return getPrismaFromContext(ctx).participation_certificate.findUnique({
      where: {
        id: participation_certificate.id,
      },
    }).pupil({});
  }

  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() participation_certificate: Participation_certificate, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).participation_certificate.findUnique({
      where: {
        id: participation_certificate.id,
      },
    }).student({});
  }
}
