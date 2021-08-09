import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningWhereInput } from "../inputs/Instructor_screeningWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Instructor_screeningRelationFilter {
  @TypeGraphQL.Field(_type => Instructor_screeningWhereInput, {
    nullable: true
  })
  is?: Instructor_screeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningWhereInput, {
    nullable: true
  })
  isNot?: Instructor_screeningWhereInput | undefined;
}
