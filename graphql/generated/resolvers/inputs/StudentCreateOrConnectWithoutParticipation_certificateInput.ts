import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutParticipation_certificateInput } from "../inputs/StudentCreateWithoutParticipation_certificateInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutParticipation_certificateInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutParticipation_certificateInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutParticipation_certificateInput, {
    nullable: false
  })
  create!: StudentCreateWithoutParticipation_certificateInput;
}
