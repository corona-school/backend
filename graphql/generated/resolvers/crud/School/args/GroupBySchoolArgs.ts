import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SchoolOrderByInput } from "../../../inputs/SchoolOrderByInput";
import { SchoolScalarWhereWithAggregatesInput } from "../../../inputs/SchoolScalarWhereWithAggregatesInput";
import { SchoolWhereInput } from "../../../inputs/SchoolWhereInput";
import { SchoolScalarFieldEnum } from "../../../../enums/SchoolScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupBySchoolArgs {
  @TypeGraphQL.Field(_type => SchoolWhereInput, {
    nullable: true
  })
  where?: SchoolWhereInput | undefined;

  @TypeGraphQL.Field(_type => [SchoolOrderByInput], {
    nullable: true
  })
  orderBy?: SchoolOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [SchoolScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "name" | "website" | "emailDomain" | "state" | "schooltype" | "activeCooperation">;

  @TypeGraphQL.Field(_type => SchoolScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: SchoolScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
