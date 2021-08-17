import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateInstructor_screeningArgs } from "./args/AggregateInstructor_screeningArgs";
import { Instructor_screening } from "../../../models/Instructor_screening";
import { AggregateInstructor_screening } from "../../outputs/AggregateInstructor_screening";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Instructor_screening)
export class AggregateInstructor_screeningResolver {
  @TypeGraphQL.Query(_returns => AggregateInstructor_screening, {
    nullable: false
  })
  async aggregateInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateInstructor_screeningArgs): Promise<AggregateInstructor_screening> {
    return getPrismaFromContext(ctx).instructor_screening.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
