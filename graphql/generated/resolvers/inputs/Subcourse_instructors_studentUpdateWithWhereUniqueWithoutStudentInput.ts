import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentUpdateWithoutStudentInput } from "../inputs/Subcourse_instructors_studentUpdateWithoutStudentInput";
import { Subcourse_instructors_studentWhereUniqueInput } from "../inputs/Subcourse_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType("Subcourse_instructors_studentUpdateWithWhereUniqueWithoutStudentInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentUpdateWithWhereUniqueWithoutStudentInput {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_instructors_studentWhereUniqueInput;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentUpdateWithoutStudentInput, {
    nullable: false
  })
  data!: Subcourse_instructors_studentUpdateWithoutStudentInput;
}
