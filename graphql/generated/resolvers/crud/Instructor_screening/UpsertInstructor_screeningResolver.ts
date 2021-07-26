import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertInstructor_screeningArgs } from "./args/UpsertInstructor_screeningArgs";
import { Instructor_screening } from "../../../models/Instructor_screening";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Instructor_screening)
export class UpsertInstructor_screeningResolver {
  @TypeGraphQL.Mutation(_returns => Instructor_screening, {
    nullable: false
  })
  async upsertInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertInstructor_screeningArgs): Promise<Instructor_screening> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
