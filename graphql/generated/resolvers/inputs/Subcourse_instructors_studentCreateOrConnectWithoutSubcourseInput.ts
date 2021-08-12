import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentCreateWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentCreateWithoutSubcourseInput";
import { Subcourse_instructors_studentWhereUniqueInput } from "../inputs/Subcourse_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentCreateOrConnectWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_instructors_studentWhereUniqueInput;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCreateWithoutSubcourseInput, {
    nullable: false
  })
  create!: Subcourse_instructors_studentCreateWithoutSubcourseInput;
}
