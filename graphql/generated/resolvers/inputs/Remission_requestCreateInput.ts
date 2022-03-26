import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutRemission_requestInput } from "../inputs/StudentCreateNestedOneWithoutRemission_requestInput";

@TypeGraphQL.InputType("Remission_requestCreateInput", {
  isAbstract: true
})
export class Remission_requestCreateInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutRemission_requestInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutRemission_requestInput | undefined;
}
