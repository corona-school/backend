import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningCreateNestedManyWithoutScreenerInput } from "../inputs/Instructor_screeningCreateNestedManyWithoutScreenerInput";
import { Project_coaching_screeningCreateNestedManyWithoutScreenerInput } from "../inputs/Project_coaching_screeningCreateNestedManyWithoutScreenerInput";

@TypeGraphQL.InputType("ScreenerCreateWithoutScreeningsInput", {
  isAbstract: true
})
export class ScreenerCreateWithoutScreeningsInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  firstname?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  lastname?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  active?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  verification?: string | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  verifiedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  authToken?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  authTokenUsed?: boolean | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  authTokenSent?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  password!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  verified?: boolean | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  oldNumberID?: number | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningCreateNestedManyWithoutScreenerInput, {
    nullable: true
  })
  instructor_screening?: Instructor_screeningCreateNestedManyWithoutScreenerInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateNestedManyWithoutScreenerInput, {
    nullable: true
  })
  project_coaching_screening?: Project_coaching_screeningCreateNestedManyWithoutScreenerInput | undefined;
}
