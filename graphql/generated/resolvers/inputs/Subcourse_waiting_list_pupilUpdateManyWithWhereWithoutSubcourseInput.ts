import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilScalarWhereInput } from "../inputs/Subcourse_waiting_list_pupilScalarWhereInput";
import { Subcourse_waiting_list_pupilUpdateManyMutationInput } from "../inputs/Subcourse_waiting_list_pupilUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilUpdateManyWithWhereWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilScalarWhereInput, {
    nullable: false
  })
  where!: Subcourse_waiting_list_pupilScalarWhereInput;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilUpdateManyMutationInput, {
    nullable: false
  })
  data!: Subcourse_waiting_list_pupilUpdateManyMutationInput;
}
