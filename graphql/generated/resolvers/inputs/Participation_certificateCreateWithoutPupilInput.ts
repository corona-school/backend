import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutParticipation_certificateInput } from "../inputs/StudentCreateNestedOneWithoutParticipation_certificateInput";

@TypeGraphQL.InputType("Participation_certificateCreateWithoutPupilInput", {
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

  @TypeGraphQL.Field(_type => DecimalJSScalar, {
    nullable: false
  })
  hoursPerWeek!: Prisma.Decimal;

  @TypeGraphQL.Field(_type => DecimalJSScalar, {
    nullable: false
  })
  hoursTotal!: Prisma.Decimal;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  medium!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  ongoingLessons?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  state?: string | undefined;

  @TypeGraphQL.Field(_type => GraphQLScalars.ByteResolver, {
    nullable: true
  })
  signaturePupil?: Buffer | undefined;

  @TypeGraphQL.Field(_type => GraphQLScalars.ByteResolver, {
    nullable: true
  })
  signatureParent?: Buffer | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  signatureLocation?: string | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  signatureDate?: Date | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutParticipation_certificateInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutParticipation_certificateInput | undefined;
}
