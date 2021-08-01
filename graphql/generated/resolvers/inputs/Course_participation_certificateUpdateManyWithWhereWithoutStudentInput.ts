import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateScalarWhereInput } from "../inputs/Course_participation_certificateScalarWhereInput";
import { Course_participation_certificateUpdateManyMutationInput } from "../inputs/Course_participation_certificateUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_participation_certificateUpdateManyWithWhereWithoutStudentInput {
  @TypeGraphQL.Field(_type => Course_participation_certificateScalarWhereInput, {
    nullable: false
  })
  where!: Course_participation_certificateScalarWhereInput;

  @TypeGraphQL.Field(_type => Course_participation_certificateUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_participation_certificateUpdateManyMutationInput;
}
