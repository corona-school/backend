import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Instructor_screening } from "../models/Instructor_screening";
import { Project_coaching_screening } from "../models/Project_coaching_screening";
import { Screening } from "../models/Screening";
import { ScreenerCount } from "../resolvers/outputs/ScreenerCount";

@TypeGraphQL.ObjectType("Screener", {
  isAbstract: true
})
export class Screener {
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
    nullable: true
  })
  firstname?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  lastname?: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  active!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  verification?: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  verifiedAt?: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  authToken?: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  authTokenUsed!: boolean;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  authTokenSent?: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  password!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  verified?: boolean | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  oldNumberID?: number | null;

  instructor_screening?: Instructor_screening[];

  project_coaching_screening?: Project_coaching_screening[];

  screenings?: Screening[];

  @TypeGraphQL.Field(_type => ScreenerCount, {
    nullable: true
  })
  _count?: ScreenerCount | null;
}
