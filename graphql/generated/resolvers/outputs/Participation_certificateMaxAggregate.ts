import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Participation_certificateMaxAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  uuid!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  subjects!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  categories!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  certificateDate!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  startDate!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  endDate!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  hoursPerWeek!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true
  })
  hoursTotal!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  medium!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  pupilId!: number | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  ongoingLessons!: boolean | null;
}
