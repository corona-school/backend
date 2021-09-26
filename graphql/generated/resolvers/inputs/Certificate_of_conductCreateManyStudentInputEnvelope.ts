import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductCreateManyStudentInput } from "../inputs/Certificate_of_conductCreateManyStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [Certificate_of_conductCreateManyStudentInput], {
    nullable: false
  })
  data!: Certificate_of_conductCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
