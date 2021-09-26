import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentCreateManyCourseInput } from "../inputs/Course_instructors_studentCreateManyCourseInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentCreateManyCourseInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_instructors_studentCreateManyCourseInput], {
    nullable: false
  })
  data!: Course_instructors_studentCreateManyCourseInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
