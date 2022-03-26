import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Student } from "../models/Student";
import { Subcourse } from "../models/Subcourse";

@TypeGraphQL.ObjectType("Subcourse_instructors_student", {
  isAbstract: true
})
export class Subcourse_instructors_student {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  subcourseId!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  studentId!: number;

  student?: Student;

  subcourse?: Subcourse;
}
