import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningCreateOrConnectWithoutStudentInput } from "../inputs/Project_coaching_screeningCreateOrConnectWithoutStudentInput";
import { Project_coaching_screeningCreateWithoutStudentInput } from "../inputs/Project_coaching_screeningCreateWithoutStudentInput";
import { Project_coaching_screeningUpdateWithoutStudentInput } from "../inputs/Project_coaching_screeningUpdateWithoutStudentInput";
import { Project_coaching_screeningUpsertWithoutStudentInput } from "../inputs/Project_coaching_screeningUpsertWithoutStudentInput";
import { Project_coaching_screeningWhereUniqueInput } from "../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_coaching_screeningUpdateOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Project_coaching_screeningCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Project_coaching_screeningCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningUpsertWithoutStudentInput, {
    nullable: true
  })
  upsert?: Project_coaching_screeningUpsertWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereUniqueInput, {
    nullable: true
  })
  connect?: Project_coaching_screeningWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningUpdateWithoutStudentInput, {
    nullable: true
  })
  update?: Project_coaching_screeningUpdateWithoutStudentInput | undefined;
}
