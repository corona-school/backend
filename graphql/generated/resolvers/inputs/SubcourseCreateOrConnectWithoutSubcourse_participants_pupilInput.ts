import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseCreateWithoutSubcourse_participants_pupilInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType("SubcourseCreateOrConnectWithoutSubcourse_participants_pupilInput", {
  isAbstract: true
})
export class SubcourseCreateOrConnectWithoutSubcourse_participants_pupilInput {
  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: false
  })
  where!: SubcourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutSubcourse_participants_pupilInput;
}
