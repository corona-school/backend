import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateNestedOneWithoutScreeningInput } from "../inputs/ScreenerCreateNestedOneWithoutScreeningInput";
import { StudentCreateNestedOneWithoutScreeningInput } from "../inputs/StudentCreateNestedOneWithoutScreeningInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreeningCreateInput {
  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  success!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  comment?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  knowsCoronaSchoolFrom?: string | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateNestedOneWithoutScreeningInput, {
    nullable: true
  })
  screener?: ScreenerCreateNestedOneWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutScreeningInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutScreeningInput | undefined;
}
