import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { expert_data_allowed_enum } from "../../enums/expert_data_allowed_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_dataCreateManyInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

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
  contactEmail!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  active?: boolean | undefined;

  @TypeGraphQL.Field(_type => expert_data_allowed_enum, {
    nullable: true
  })
  allowed?: "pending" | "yes" | "no" | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId?: number | undefined;
}
