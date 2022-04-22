import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutParticipation_certificateInput } from "../inputs/StudentCreateWithoutParticipation_certificateInput";
import { StudentUpdateWithoutParticipation_certificateInput } from "../inputs/StudentUpdateWithoutParticipation_certificateInput";

@TypeGraphQL.InputType("StudentUpsertWithoutParticipation_certificateInput", {
  isAbstract: true
})
export class StudentUpsertWithoutParticipation_certificateInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutParticipation_certificateInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutParticipation_certificateInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutParticipation_certificateInput, {
    nullable: false
  })
  create!: StudentCreateWithoutParticipation_certificateInput;
}
