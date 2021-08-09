import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateManyPupilInput } from "../inputs/Course_participation_certificateCreateManyPupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_participation_certificateCreateManyPupilInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateManyPupilInput], {
    nullable: false
  })
  data!: Course_participation_certificateCreateManyPupilInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
