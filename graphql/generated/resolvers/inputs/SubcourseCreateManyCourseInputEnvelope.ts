import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateManyCourseInput } from "../inputs/SubcourseCreateManyCourseInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseCreateManyCourseInputEnvelope {
  @TypeGraphQL.Field(_type => [SubcourseCreateManyCourseInput], {
    nullable: false
  })
  data!: SubcourseCreateManyCourseInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
