import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateUpdateWithoutPupilInput } from "../inputs/Course_participation_certificateUpdateWithoutPupilInput";
import { Course_participation_certificateWhereUniqueInput } from "../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Course_participation_certificateUpdateWithWhereUniqueWithoutPupilInput", {
  isAbstract: true
})
export class Course_participation_certificateUpdateWithWhereUniqueWithoutPupilInput {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Course_participation_certificateWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_participation_certificateUpdateWithoutPupilInput, {
    nullable: false
  })
  data!: Course_participation_certificateUpdateWithoutPupilInput;
}
