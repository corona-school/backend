import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentScalarWhereInput } from "../inputs/Subcourse_instructors_studentScalarWhereInput";
import { Subcourse_instructors_studentUpdateManyMutationInput } from "../inputs/Subcourse_instructors_studentUpdateManyMutationInput";

@TypeGraphQL.InputType("Subcourse_instructors_studentUpdateManyWithWhereWithoutStudentInput", {
  isAbstract: true
})
export class Subcourse_instructors_studentUpdateManyWithWhereWithoutStudentInput {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentScalarWhereInput, {
    nullable: false
  })
  where!: Subcourse_instructors_studentScalarWhereInput;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentUpdateManyMutationInput, {
    nullable: false
  })
  data!: Subcourse_instructors_studentUpdateManyMutationInput;
}
