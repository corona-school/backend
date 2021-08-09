import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateManySubcourseInput } from "../inputs/LectureCreateManySubcourseInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureCreateManySubcourseInputEnvelope {
  @TypeGraphQL.Field(_type => [LectureCreateManySubcourseInput], {
    nullable: false
  })
  data!: LectureCreateManySubcourseInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
