import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateCreateWithoutStudentInput } from "../inputs/Participation_certificateCreateWithoutStudentInput";
import { Participation_certificateWhereUniqueInput } from "../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Participation_certificateCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => Participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Participation_certificateWhereUniqueInput;

  @TypeGraphQL.Field(_type => Participation_certificateCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Participation_certificateCreateWithoutStudentInput;
}
