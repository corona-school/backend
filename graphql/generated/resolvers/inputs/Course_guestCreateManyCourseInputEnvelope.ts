import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestCreateManyCourseInput } from "../inputs/Course_guestCreateManyCourseInput";

@TypeGraphQL.InputType("Course_guestCreateManyCourseInputEnvelope", {
  isAbstract: true
})
export class Course_guestCreateManyCourseInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_guestCreateManyCourseInput], {
    nullable: false
  })
  data!: Course_guestCreateManyCourseInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
