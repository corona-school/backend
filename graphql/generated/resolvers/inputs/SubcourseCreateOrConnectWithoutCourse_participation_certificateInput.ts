import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutCourse_participation_certificateInput } from "../inputs/SubcourseCreateWithoutCourse_participation_certificateInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseCreateOrConnectWithoutCourse_participation_certificateInput {
  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: false
  })
  where!: SubcourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutCourse_participation_certificateInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutCourse_participation_certificateInput;
}
