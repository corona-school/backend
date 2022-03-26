import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutJufo_verification_transmissionInput } from "../inputs/StudentCreateNestedOneWithoutJufo_verification_transmissionInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Jufo_verification_transmissionCreateInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutJufo_verification_transmissionInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutJufo_verification_transmissionInput | undefined;
}
