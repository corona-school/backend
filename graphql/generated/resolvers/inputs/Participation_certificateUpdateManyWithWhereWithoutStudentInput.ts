import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateScalarWhereInput } from "../inputs/Participation_certificateScalarWhereInput";
import { Participation_certificateUpdateManyMutationInput } from "../inputs/Participation_certificateUpdateManyMutationInput";

@TypeGraphQL.InputType("Participation_certificateUpdateManyWithWhereWithoutStudentInput", {
  isAbstract: true
})
export class Participation_certificateUpdateManyWithWhereWithoutStudentInput {
  @TypeGraphQL.Field(_type => Participation_certificateScalarWhereInput, {
    nullable: false
  })
  where!: Participation_certificateScalarWhereInput;

  @TypeGraphQL.Field(_type => Participation_certificateUpdateManyMutationInput, {
    nullable: false
  })
  data!: Participation_certificateUpdateManyMutationInput;
}
