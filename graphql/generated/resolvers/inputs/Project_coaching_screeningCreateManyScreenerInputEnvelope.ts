import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningCreateManyScreenerInput } from "../inputs/Project_coaching_screeningCreateManyScreenerInput";

@TypeGraphQL.InputType("Project_coaching_screeningCreateManyScreenerInputEnvelope", {
  isAbstract: true
})
export class Project_coaching_screeningCreateManyScreenerInputEnvelope {
  @TypeGraphQL.Field(_type => [Project_coaching_screeningCreateManyScreenerInput], {
    nullable: false
  })
  data!: Project_coaching_screeningCreateManyScreenerInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
