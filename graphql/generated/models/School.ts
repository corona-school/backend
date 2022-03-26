import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Pupil } from "../models/Pupil";
import { school_schooltype_enum } from "../enums/school_schooltype_enum";
import { school_state_enum } from "../enums/school_state_enum";
import { SchoolCount } from "../resolvers/outputs/SchoolCount";

@TypeGraphQL.ObjectType("School", {
  isAbstract: true
})
export class School {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  website?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  emailDomain!: string;

  @TypeGraphQL.Field(_type => school_state_enum, {
    nullable: true
  })
  state?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | null;

  @TypeGraphQL.Field(_type => school_schooltype_enum, {
    nullable: false
  })
  schooltype!: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other";

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  activeCooperation!: boolean;

  pupil?: Pupil[];

  @TypeGraphQL.Field(_type => SchoolCount, {
    nullable: true
  })
  _count?: SchoolCount | null;
}
