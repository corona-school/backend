import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentWhereInput } from "../inputs/Course_instructors_studentWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentListRelationFilter {
  @TypeGraphQL.Field(_type => Course_instructors_studentWhereInput, {
    nullable: true
  })
  every?: Course_instructors_studentWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentWhereInput, {
    nullable: true
  })
  some?: Course_instructors_studentWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentWhereInput, {
    nullable: true
  })
  none?: Course_instructors_studentWhereInput | undefined;
}
