import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutInstructor_screeningInput } from "../inputs/StudentCreateOrConnectWithoutInstructor_screeningInput";
import { StudentCreateWithoutInstructor_screeningInput } from "../inputs/StudentCreateWithoutInstructor_screeningInput";
import { StudentUpdateWithoutInstructor_screeningInput } from "../inputs/StudentUpdateWithoutInstructor_screeningInput";
import { StudentUpsertWithoutInstructor_screeningInput } from "../inputs/StudentUpsertWithoutInstructor_screeningInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpdateOneWithoutInstructor_screeningInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutInstructor_screeningInput, {
    nullable: true
  })
  create?: StudentCreateWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutInstructor_screeningInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutInstructor_screeningInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateWithoutInstructor_screeningInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutInstructor_screeningInput | undefined;
}
