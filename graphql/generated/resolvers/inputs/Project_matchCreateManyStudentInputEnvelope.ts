import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchCreateManyStudentInput } from "../inputs/Project_matchCreateManyStudentInput";

@TypeGraphQL.InputType("Project_matchCreateManyStudentInputEnvelope", {
  isAbstract: true
})
export class Project_matchCreateManyStudentInputEnvelope {
  @TypeGraphQL.Field(_type => [Project_matchCreateManyStudentInput], {
    nullable: false
  })
  data!: Project_matchCreateManyStudentInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
