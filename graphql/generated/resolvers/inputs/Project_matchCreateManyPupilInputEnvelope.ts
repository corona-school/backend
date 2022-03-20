import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchCreateManyPupilInput } from "../inputs/Project_matchCreateManyPupilInput";

@TypeGraphQL.InputType("Project_matchCreateManyPupilInputEnvelope", {
  isAbstract: true
})
export class Project_matchCreateManyPupilInputEnvelope {
  @TypeGraphQL.Field(_type => [Project_matchCreateManyPupilInput], {
    nullable: false
  })
  data!: Project_matchCreateManyPupilInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
