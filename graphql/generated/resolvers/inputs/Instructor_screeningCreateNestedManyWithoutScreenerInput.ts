import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningCreateManyScreenerInputEnvelope } from "../inputs/Instructor_screeningCreateManyScreenerInputEnvelope";
import { Instructor_screeningCreateOrConnectWithoutScreenerInput } from "../inputs/Instructor_screeningCreateOrConnectWithoutScreenerInput";
import { Instructor_screeningCreateWithoutScreenerInput } from "../inputs/Instructor_screeningCreateWithoutScreenerInput";
import { Instructor_screeningWhereUniqueInput } from "../inputs/Instructor_screeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Instructor_screeningCreateNestedManyWithoutScreenerInput {
  @TypeGraphQL.Field(_type => [Instructor_screeningCreateWithoutScreenerInput], {
    nullable: true
  })
  create?: Instructor_screeningCreateWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningCreateOrConnectWithoutScreenerInput], {
    nullable: true
  })
  connectOrCreate?: Instructor_screeningCreateOrConnectWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningCreateManyScreenerInputEnvelope, {
    nullable: true
  })
  createMany?: Instructor_screeningCreateManyScreenerInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningWhereUniqueInput], {
    nullable: true
  })
  connect?: Instructor_screeningWhereUniqueInput[] | undefined;
}
