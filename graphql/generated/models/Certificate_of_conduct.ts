import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Screener } from "../models/Screener";
import { Student } from "../models/Student";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Certificate_of_conduct {
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

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  dateOfInspection!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  dateOfIssue!: Date;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  criminalRecords!: boolean;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  inspectingScreenerId?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId?: number | null;

  inspectingScreener?: Screener | null;

  student?: Student | null;
}
