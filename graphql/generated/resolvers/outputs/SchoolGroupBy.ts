import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SchoolAvgAggregate } from "../outputs/SchoolAvgAggregate";
import { SchoolCountAggregate } from "../outputs/SchoolCountAggregate";
import { SchoolMaxAggregate } from "../outputs/SchoolMaxAggregate";
import { SchoolMinAggregate } from "../outputs/SchoolMinAggregate";
import { SchoolSumAggregate } from "../outputs/SchoolSumAggregate";
import { school_schooltype_enum } from "../../enums/school_schooltype_enum";
import { school_state_enum } from "../../enums/school_state_enum";

@TypeGraphQL.ObjectType("SchoolGroupBy", {
  isAbstract: true
})
export class SchoolGroupBy {
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
  website!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  emailDomain!: string;

  @TypeGraphQL.Field(_type => school_state_enum, {
    nullable: true
  })
  state!: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | null;

  @TypeGraphQL.Field(_type => school_schooltype_enum, {
    nullable: false
  })
  schooltype!: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other";

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  activeCooperation!: boolean;

  @TypeGraphQL.Field(_type => SchoolCountAggregate, {
    nullable: true
  })
  _count!: SchoolCountAggregate | null;

  @TypeGraphQL.Field(_type => SchoolAvgAggregate, {
    nullable: true
  })
  _avg!: SchoolAvgAggregate | null;

  @TypeGraphQL.Field(_type => SchoolSumAggregate, {
    nullable: true
  })
  _sum!: SchoolSumAggregate | null;

  @TypeGraphQL.Field(_type => SchoolMinAggregate, {
    nullable: true
  })
  _min!: SchoolMinAggregate | null;

  @TypeGraphQL.Field(_type => SchoolMaxAggregate, {
    nullable: true
  })
  _max!: SchoolMaxAggregate | null;
}
