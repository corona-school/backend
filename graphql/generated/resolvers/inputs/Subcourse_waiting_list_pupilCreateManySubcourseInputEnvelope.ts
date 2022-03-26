import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilCreateManySubcourseInput } from "../inputs/Subcourse_waiting_list_pupilCreateManySubcourseInput";

@TypeGraphQL.InputType("Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope", {
  isAbstract: true
})
export class Subcourse_waiting_list_pupilCreateManySubcourseInputEnvelope {
  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateManySubcourseInput], {
    nullable: false
  })
  data!: Subcourse_waiting_list_pupilCreateManySubcourseInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
