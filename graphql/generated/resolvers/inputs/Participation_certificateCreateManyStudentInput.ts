import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Participation_certificateCreateManyStudentInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  subjects!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  categories!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  certificateDate?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  startDate?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  endDate?: Date | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: false
  })
  hoursPerWeek!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: false
  })
  hoursTotal!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  medium!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  pupilId?: number | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  ongoingLessons?: boolean | undefined;
}
