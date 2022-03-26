import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Pupil } from "../models/Pupil";
import { Student } from "../models/Student";
import { Subcourse } from "../models/Subcourse";

@TypeGraphQL.ObjectType("Course_participation_certificate", {
  isAbstract: true
})
export class Course_participation_certificate {
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

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  issuerId?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  pupilId?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  subcourseId?: number | null;

  student?: Student | null;

  pupil?: Pupil | null;

  subcourse?: Subcourse | null;
}
