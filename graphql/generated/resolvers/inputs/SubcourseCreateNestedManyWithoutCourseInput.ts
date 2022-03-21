import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateManyCourseInputEnvelope } from "../inputs/SubcourseCreateManyCourseInputEnvelope";
import { SubcourseCreateOrConnectWithoutCourseInput } from "../inputs/SubcourseCreateOrConnectWithoutCourseInput";
import { SubcourseCreateWithoutCourseInput } from "../inputs/SubcourseCreateWithoutCourseInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType("SubcourseCreateNestedManyWithoutCourseInput", {
  isAbstract: true
})
export class SubcourseCreateNestedManyWithoutCourseInput {
  @TypeGraphQL.Field(_type => [SubcourseCreateWithoutCourseInput], {
    nullable: true
  })
  create?: SubcourseCreateWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseCreateOrConnectWithoutCourseInput], {
    nullable: true
  })
  connectOrCreate?: SubcourseCreateOrConnectWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateManyCourseInputEnvelope, {
    nullable: true
  })
  createMany?: SubcourseCreateManyCourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [SubcourseWhereUniqueInput], {
    nullable: true
  })
  connect?: SubcourseWhereUniqueInput[] | undefined;
}
