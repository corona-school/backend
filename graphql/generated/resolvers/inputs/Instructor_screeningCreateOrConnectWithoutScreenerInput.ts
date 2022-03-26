import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningCreateWithoutScreenerInput } from "../inputs/Instructor_screeningCreateWithoutScreenerInput";
import { Instructor_screeningWhereUniqueInput } from "../inputs/Instructor_screeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Instructor_screeningCreateOrConnectWithoutScreenerInput {
  @TypeGraphQL.Field(_type => Instructor_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Instructor_screeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => Instructor_screeningCreateWithoutScreenerInput, {
    nullable: false
  })
  create!: Instructor_screeningCreateWithoutScreenerInput;
}
