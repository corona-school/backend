import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningCreateOrConnectWithoutStudentInput } from "../inputs/Instructor_screeningCreateOrConnectWithoutStudentInput";
import { Instructor_screeningCreateWithoutStudentInput } from "../inputs/Instructor_screeningCreateWithoutStudentInput";
import { Instructor_screeningUpdateWithoutStudentInput } from "../inputs/Instructor_screeningUpdateWithoutStudentInput";
import { Instructor_screeningUpsertWithoutStudentInput } from "../inputs/Instructor_screeningUpsertWithoutStudentInput";
import { Instructor_screeningWhereUniqueInput } from "../inputs/Instructor_screeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Instructor_screeningUpdateOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Instructor_screeningCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Instructor_screeningCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Instructor_screeningCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningUpsertWithoutStudentInput, {
    nullable: true
  })
  upsert?: Instructor_screeningUpsertWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningWhereUniqueInput, {
    nullable: true
  })
  connect?: Instructor_screeningWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningUpdateWithoutStudentInput, {
    nullable: true
  })
  update?: Instructor_screeningUpdateWithoutStudentInput | undefined;
}
