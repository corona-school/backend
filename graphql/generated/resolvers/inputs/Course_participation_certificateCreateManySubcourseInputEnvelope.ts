import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateManySubcourseInput } from "../inputs/Course_participation_certificateCreateManySubcourseInput";

@TypeGraphQL.InputType("Course_participation_certificateCreateManySubcourseInputEnvelope", {
  isAbstract: true
})
export class Course_participation_certificateCreateManySubcourseInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateManySubcourseInput], {
    nullable: false
  })
  data!: Course_participation_certificateCreateManySubcourseInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
