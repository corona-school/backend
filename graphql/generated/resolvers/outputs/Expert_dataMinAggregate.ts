import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { expert_data_allowed_enum } from "../../enums/expert_data_allowed_enum";

@TypeGraphQL.ObjectType("Expert_dataMinAggregate", {
  isAbstract: true
})
export class Expert_dataMinAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  contactEmail!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  active!: boolean | null;

  @TypeGraphQL.Field(_type => expert_data_allowed_enum, {
    nullable: true
  })
  allowed!: "pending" | "yes" | "no" | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId!: number | null;
}
