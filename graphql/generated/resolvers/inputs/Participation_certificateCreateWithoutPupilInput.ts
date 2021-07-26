import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutParticipation_certificateInput } from "../inputs/StudentCreateNestedOneWithoutParticipation_certificateInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Participation_certificateCreateWithoutPupilInput {
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

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  ongoingLessons?: boolean | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutParticipation_certificateInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutParticipation_certificateInput | undefined;
}
