import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningWhereInput } from "../inputs/Instructor_screeningWhereInput";

@TypeGraphQL.InputType("Instructor_screeningListRelationFilter", {
  isAbstract: true
})
export class Instructor_screeningListRelationFilter {
  @TypeGraphQL.Field(_type => Instructor_screeningWhereInput, {
    nullable: true
  })
  every?: Instructor_screeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningWhereInput, {
    nullable: true
  })
  some?: Instructor_screeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningWhereInput, {
    nullable: true
  })
  none?: Instructor_screeningWhereInput | undefined;
}
