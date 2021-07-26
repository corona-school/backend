import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindFirstInstructor_screeningArgs } from "./args/FindFirstInstructor_screeningArgs";
import { Instructor_screening } from "../../../models/Instructor_screening";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Instructor_screening)
export class FindFirstInstructor_screeningResolver {
  @TypeGraphQL.Query(_returns => Instructor_screening, {
    nullable: true
  })
  async findFirstInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstInstructor_screeningArgs): Promise<Instructor_screening | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
