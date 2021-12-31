import * as TypeGraphQL from "type-graphql";
import { Instructor_screening } from "../../../models/Instructor_screening";
import { Project_coaching_screening } from "../../../models/Project_coaching_screening";
import { Screener } from "../../../models/Screener";
import { Screening } from "../../../models/Screening";
import { ScreenerInstructor_screeningArgs } from "./args/ScreenerInstructor_screeningArgs";
import { ScreenerProject_coaching_screeningArgs } from "./args/ScreenerProject_coaching_screeningArgs";
import { ScreenerScreeningsArgs } from "./args/ScreenerScreeningsArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Screener)
export class ScreenerRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => [Instructor_screening], {
    nullable: false
  })
  async instructor_screening(@TypeGraphQL.Root() screener: Screener, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: ScreenerInstructor_screeningArgs): Promise<Instructor_screening[]> {
    return getPrismaFromContext(ctx).screener.findUnique({
      where: {
        id: screener.id,
      },
    }).instructor_screening(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Project_coaching_screening], {
    nullable: false
  })
  async project_coaching_screening(@TypeGraphQL.Root() screener: Screener, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: ScreenerProject_coaching_screeningArgs): Promise<Project_coaching_screening[]> {
    return getPrismaFromContext(ctx).screener.findUnique({
      where: {
        id: screener.id,
      },
    }).project_coaching_screening(args);
  }

  @TypeGraphQL.FieldResolver(_type => [Screening], {
    nullable: false
  })
  async screenings(@TypeGraphQL.Root() screener: Screener, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: ScreenerScreeningsArgs): Promise<Screening[]> {
    return getPrismaFromContext(ctx).screener.findUnique({
      where: {
        id: screener.id,
      },
    }).screenings(args);
  }
}
