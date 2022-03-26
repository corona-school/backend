import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("Jufo_verification_transmissionCreateManyInput", {
  isAbstract: true
})
export class Jufo_verification_transmissionCreateManyInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId?: number | undefined;
}
