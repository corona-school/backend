import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateNestedManyWithoutSchoolInput } from "../inputs/PupilCreateNestedManyWithoutSchoolInput";
import { school_schooltype_enum } from "../../enums/school_schooltype_enum";
import { school_state_enum } from "../../enums/school_state_enum";

@TypeGraphQL.InputType("SchoolCreateInput", {
  isAbstract: true
})
export class SchoolCreateInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  website?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  emailDomain!: string;

  @TypeGraphQL.Field(_type => school_state_enum, {
    nullable: true
  })
  state?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;

  @TypeGraphQL.Field(_type => school_schooltype_enum, {
    nullable: true
  })
  schooltype?: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other" | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  activeCooperation?: boolean | undefined;

  @TypeGraphQL.Field(_type => PupilCreateNestedManyWithoutSchoolInput, {
    nullable: true
  })
  pupil?: PupilCreateNestedManyWithoutSchoolInput | undefined;
}
