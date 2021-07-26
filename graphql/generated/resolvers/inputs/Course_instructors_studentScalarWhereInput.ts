import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntFilter } from "../inputs/IntFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentScalarWhereInput {
  @TypeGraphQL.Field(_type => [Course_instructors_studentScalarWhereInput], {
    nullable: true
  })
  AND?: Course_instructors_studentScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentScalarWhereInput], {
    nullable: true
  })
  OR?: Course_instructors_studentScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_instructors_studentScalarWhereInput], {
    nullable: true
  })
  NOT?: Course_instructors_studentScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  courseId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  studentId?: IntFilter | undefined;
}
