import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningCreateWithoutStudentInput } from "../inputs/Project_coaching_screeningCreateWithoutStudentInput";
import { Project_coaching_screeningUpdateWithoutStudentInput } from "../inputs/Project_coaching_screeningUpdateWithoutStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_coaching_screeningUpsertWithoutStudentInput {
  @TypeGraphQL.Field(_type => Project_coaching_screeningUpdateWithoutStudentInput, {
    nullable: false
  })
  update!: Project_coaching_screeningUpdateWithoutStudentInput;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Project_coaching_screeningCreateWithoutStudentInput;
}
