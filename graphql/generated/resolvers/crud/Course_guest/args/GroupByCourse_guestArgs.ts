import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_guestOrderByInput } from "../../../inputs/Course_guestOrderByInput";
import { Course_guestScalarWhereWithAggregatesInput } from "../../../inputs/Course_guestScalarWhereWithAggregatesInput";
import { Course_guestWhereInput } from "../../../inputs/Course_guestWhereInput";
import { Course_guestScalarFieldEnum } from "../../../../enums/Course_guestScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByCourse_guestArgs {
  @TypeGraphQL.Field(_type => Course_guestWhereInput, {
    nullable: true
  })
  where?: Course_guestWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_guestOrderByInput], {
    nullable: true
  })
  orderBy?: Course_guestOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_guestScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "token" | "firstname" | "lastname" | "email" | "courseId" | "inviterId">;

  @TypeGraphQL.Field(_type => Course_guestScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Course_guestScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
