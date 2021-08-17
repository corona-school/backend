import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilCreateManySubcourseInput } from "../inputs/Subcourse_participants_pupilCreateManySubcourseInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_participants_pupilCreateManySubcourseInputEnvelope {
  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilCreateManySubcourseInput], {
    nullable: false
  })
  data!: Subcourse_participants_pupilCreateManySubcourseInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
