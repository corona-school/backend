import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateStudentArgs } from "./args/AggregateStudentArgs";
import { Student } from "../../../models/Student";
import { AggregateStudent } from "../../outputs/AggregateStudent";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Student)
export class AggregateStudentResolver {
  @TypeGraphQL.Query(_returns => AggregateStudent, {
    nullable: false
  })
  async aggregateStudent(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateStudentArgs): Promise<AggregateStudent> {
    return getPrismaFromContext(ctx).student.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
