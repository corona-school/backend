import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutSubcourse_instructors_studentInput } from "../inputs/SubcourseCreateWithoutSubcourse_instructors_studentInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseCreateOrConnectWithoutSubcourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: false
  })
  where!: SubcourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutSubcourse_instructors_studentInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutSubcourse_instructors_studentInput;
}
