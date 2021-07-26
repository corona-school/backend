import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumstudent_registrationsource_enumFilter } from "../inputs/NestedEnumstudent_registrationsource_enumFilter";
import { student_registrationsource_enum } from "../../enums/student_registrationsource_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumstudent_registrationsource_enumFilter {
  @TypeGraphQL.Field(_type => student_registrationsource_enum, {
    nullable: true
  })
  equals?: "normal" | "cooperation" | "drehtuer" | "other" | undefined;

  @TypeGraphQL.Field(_type => [student_registrationsource_enum], {
    nullable: true
  })
  in?: Array<"normal" | "cooperation" | "drehtuer" | "other"> | undefined;

  @TypeGraphQL.Field(_type => [student_registrationsource_enum], {
    nullable: true
  })
  notIn?: Array<"normal" | "cooperation" | "drehtuer" | "other"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumstudent_registrationsource_enumFilter, {
    nullable: true
  })
  not?: NestedEnumstudent_registrationsource_enumFilter | undefined;
}
