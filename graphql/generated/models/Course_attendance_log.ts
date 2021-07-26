import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Lecture } from "../models/Lecture";
import { Pupil } from "../models/Pupil";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Course_attendance_log {
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
  attendedTime?: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  ip?: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  pupilId?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  lectureId?: number | null;

  lecture?: Lecture | null;

  pupil?: Pupil | null;
}
