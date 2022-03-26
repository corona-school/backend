import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseScalarWhereInput } from "../inputs/SubcourseScalarWhereInput";
import { SubcourseUpdateManyMutationInput } from "../inputs/SubcourseUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseUpdateManyWithWhereWithoutCourseInput {
  @TypeGraphQL.Field(_type => SubcourseScalarWhereInput, {
    nullable: false
  })
  where!: SubcourseScalarWhereInput;

  @TypeGraphQL.Field(_type => SubcourseUpdateManyMutationInput, {
    nullable: false
  })
  data!: SubcourseUpdateManyMutationInput;
}
