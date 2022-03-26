import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutCourse_participation_certificateInput } from "../inputs/StudentCreateOrConnectWithoutCourse_participation_certificateInput";
import { StudentCreateWithoutCourse_participation_certificateInput } from "../inputs/StudentCreateWithoutCourse_participation_certificateInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateNestedOneWithoutCourse_participation_certificateInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  create?: StudentCreateWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
