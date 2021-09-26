import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutSubcourse_instructors_studentInput } from "../inputs/StudentCreateOrConnectWithoutSubcourse_instructors_studentInput";
import { StudentCreateWithoutSubcourse_instructors_studentInput } from "../inputs/StudentCreateWithoutSubcourse_instructors_studentInput";
import { StudentUpdateWithoutSubcourse_instructors_studentInput } from "../inputs/StudentUpdateWithoutSubcourse_instructors_studentInput";
import { StudentUpsertWithoutSubcourse_instructors_studentInput } from "../inputs/StudentUpsertWithoutSubcourse_instructors_studentInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpdateOneRequiredWithoutSubcourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  create?: StudentCreateWithoutSubcourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutSubcourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpsertWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  upsert?: StudentUpsertWithoutSubcourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateWithoutSubcourse_instructors_studentInput, {
    nullable: true
  })
  update?: StudentUpdateWithoutSubcourse_instructors_studentInput | undefined;
}
