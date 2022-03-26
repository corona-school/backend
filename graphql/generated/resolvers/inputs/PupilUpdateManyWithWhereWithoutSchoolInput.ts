import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilScalarWhereInput } from "../inputs/PupilScalarWhereInput";
import { PupilUpdateManyMutationInput } from "../inputs/PupilUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpdateManyWithWhereWithoutSchoolInput {
  @TypeGraphQL.Field(_type => PupilScalarWhereInput, {
    nullable: false
  })
  where!: PupilScalarWhereInput;

  @TypeGraphQL.Field(_type => PupilUpdateManyMutationInput, {
    nullable: false
  })
  data!: PupilUpdateManyMutationInput;
}
