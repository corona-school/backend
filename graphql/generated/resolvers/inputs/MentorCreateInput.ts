import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MentorCreatedivisionInput } from "../inputs/MentorCreatedivisionInput";
import { MentorCreateexpertiseInput } from "../inputs/MentorCreateexpertiseInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MentorCreateInput {
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
  wix_id!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  wix_creation_date!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  subjects?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  teachingExperience?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  message?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  imageUrl?: string | undefined;

  @TypeGraphQL.Field(_type => MentorCreatedivisionInput, {
    nullable: true
  })
  division?: MentorCreatedivisionInput | undefined;

  @TypeGraphQL.Field(_type => MentorCreateexpertiseInput, {
    nullable: true
  })
  expertise?: MentorCreateexpertiseInput | undefined;
}
