import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutParticipation_certificateInput } from "../inputs/StudentCreateOrConnectWithoutParticipation_certificateInput";
import { StudentCreateWithoutParticipation_certificateInput } from "../inputs/StudentCreateWithoutParticipation_certificateInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateNestedOneWithoutParticipation_certificateInput", {
  isAbstract: true
})
export class StudentCreateNestedOneWithoutParticipation_certificateInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutParticipation_certificateInput, {
    nullable: true
  })
  create?: StudentCreateWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutParticipation_certificateInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
