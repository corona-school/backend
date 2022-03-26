import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentCreateManySubcourseInput } from "../inputs/Subcourse_instructors_studentCreateManySubcourseInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentCreateManySubcourseInputEnvelope {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateManySubcourseInput], {
    nullable: false
  })
  data!: Subcourse_instructors_studentCreateManySubcourseInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
