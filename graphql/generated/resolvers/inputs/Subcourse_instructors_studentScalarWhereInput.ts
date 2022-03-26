import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntFilter } from "../inputs/IntFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_instructors_studentScalarWhereInput {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarWhereInput], {
    nullable: true
  })
  AND?: Subcourse_instructors_studentScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarWhereInput], {
    nullable: true
  })
  OR?: Subcourse_instructors_studentScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentScalarWhereInput], {
    nullable: true
  })
  NOT?: Subcourse_instructors_studentScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  subcourseId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  studentId?: IntFilter | undefined;
}
