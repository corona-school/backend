import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentCreateManySubcourseInputEnvelope } from "../inputs/Subcourse_instructors_studentCreateManySubcourseInputEnvelope";
import { Subcourse_instructors_studentCreateOrConnectWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentCreateOrConnectWithoutSubcourseInput";
import { Subcourse_instructors_studentCreateWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentCreateWithoutSubcourseInput";
import { Subcourse_instructors_studentWhereUniqueInput } from "../inputs/Subcourse_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentCreateNestedManyWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateWithoutSubcourseInput], {
    nullable: true
  })
  create?: Subcourse_instructors_studentCreateWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateOrConnectWithoutSubcourseInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_instructors_studentCreateOrConnectWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCreateManySubcourseInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_instructors_studentCreateManySubcourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_instructors_studentWhereUniqueInput[] | undefined;
}
