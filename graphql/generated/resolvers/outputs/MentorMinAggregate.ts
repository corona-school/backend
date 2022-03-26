import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class MentorMinAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  firstname!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  lastname!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  active!: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  email!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  verification!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  verifiedAt!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  authToken!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  authTokenUsed!: boolean | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  authTokenSent!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  wix_id!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  wix_creation_date!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  subjects!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  teachingExperience!: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  message!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  imageUrl!: string | null;
}
