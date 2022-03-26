import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Expert_data_expertise_tags_expertise_tag } from "../models/Expert_data_expertise_tags_expertise_tag";
import { Student } from "../models/Student";
import { expert_data_allowed_enum } from "../enums/expert_data_allowed_enum";
import { Expert_dataCount } from "../resolvers/outputs/Expert_dataCount";

@TypeGraphQL.ObjectType("Expert_data", {
  isAbstract: true
})
export class Expert_data {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  contactEmail!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description?: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  active!: boolean;

  @TypeGraphQL.Field(_type => expert_data_allowed_enum, {
    nullable: false
  })
  allowed!: "pending" | "yes" | "no";

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId?: number | null;

  student?: Student | null;

  expert_data_expertise_tags_expertise_tag?: Expert_data_expertise_tags_expertise_tag[];

  @TypeGraphQL.Field(_type => Expert_dataCount, {
    nullable: true
  })
  _count?: Expert_dataCount | null;
}
