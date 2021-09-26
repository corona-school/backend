import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductScalarWhereInput } from "../inputs/Certificate_of_conductScalarWhereInput";
import { Certificate_of_conductUpdateManyMutationInput } from "../inputs/Certificate_of_conductUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductUpdateManyWithWhereWithoutStudentInput {
  @TypeGraphQL.Field(_type => Certificate_of_conductScalarWhereInput, {
    nullable: false
  })
  where!: Certificate_of_conductScalarWhereInput;

  @TypeGraphQL.Field(_type => Certificate_of_conductUpdateManyMutationInput, {
    nullable: false
  })
  data!: Certificate_of_conductUpdateManyMutationInput;
}
