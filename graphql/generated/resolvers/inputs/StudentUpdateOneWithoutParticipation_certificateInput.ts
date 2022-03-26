import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutParticipation_certificateInput } from "../inputs/StudentCreateOrConnectWithoutParticipation_certificateInput";
import { StudentCreateWithoutParticipation_certificateInput } from "../inputs/StudentCreateWithoutParticipation_certificateInput";
import { StudentUpdateWithoutParticipation_certificateInput } from "../inputs/StudentUpdateWithoutParticipation_certificateInput";
import { StudentUpsertWithoutParticipation_certificateInput } from "../inputs/StudentUpsertWithoutParticipation_certificateInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentUpdateOneWithoutParticipation_certificateInput", {
  isAbstract: true
})
export class StudentUpdateOneWithoutParticipation_certificateInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutParticipation_certificateInput, {
    nullable: true
  })
  create?: StudentCreateWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutParticipation_certificateInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutParticipation_certificateInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateWithoutParticipation_certificateInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutParticipation_certificateInput | undefined;
}
