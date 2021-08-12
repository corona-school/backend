import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentWhereInput } from "../inputs/Subcourse_instructors_studentWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentListRelationFilter {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereInput, {
    nullable: true
  })
  every?: Subcourse_instructors_studentWhereInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereInput, {
    nullable: true
  })
  some?: Subcourse_instructors_studentWhereInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereInput, {
    nullable: true
  })
  none?: Subcourse_instructors_studentWhereInput | undefined;
}
