import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Screener } from "../models/Screener";
import { Student } from "../models/Student";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Instructor_screening {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  success!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  comment?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  knowsCoronaSchoolFrom?: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  screenerId?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId?: number | null;

  screener?: Screener | null;

  student?: Student | null;
}
