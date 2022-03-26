import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagOrderByInput } from "../../../inputs/Course_tagOrderByInput";
import { Course_tagScalarWhereWithAggregatesInput } from "../../../inputs/Course_tagScalarWhereWithAggregatesInput";
import { Course_tagWhereInput } from "../../../inputs/Course_tagWhereInput";
import { Course_tagScalarFieldEnum } from "../../../../enums/Course_tagScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByCourse_tagArgs {
  @TypeGraphQL.Field(_type => Course_tagWhereInput, {
    nullable: true
  })
  where?: Course_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_tagOrderByInput], {
    nullable: true
  })
  orderBy?: Course_tagOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_tagScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "identifier" | "name" | "category">;

  @TypeGraphQL.Field(_type => Course_tagScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Course_tagScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
