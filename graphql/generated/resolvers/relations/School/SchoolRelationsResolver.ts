import * as TypeGraphQL from "type-graphql";
import { Pupil } from "../../../models/Pupil";
import { School } from "../../../models/School";
import { SchoolPupilArgs } from "./args/SchoolPupilArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => School)
export class SchoolRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => [Pupil], {
    nullable: false
  })
  async pupil(@TypeGraphQL.Root() school: School, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: SchoolPupilArgs): Promise<Pupil[]> {
    return getPrismaFromContext(ctx).school.findUnique({
      where: {
        id: school.id,
      },
    }).pupil(args);
  }
}
