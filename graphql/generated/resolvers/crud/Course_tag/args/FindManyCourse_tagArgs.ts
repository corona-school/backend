import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagOrderByInput } from "../../../inputs/Course_tagOrderByInput";
import { Course_tagWhereInput } from "../../../inputs/Course_tagWhereInput";
import { Course_tagWhereUniqueInput } from "../../../inputs/Course_tagWhereUniqueInput";
import { Course_tagScalarFieldEnum } from "../../../../enums/Course_tagScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyCourse_tagArgs {
  @TypeGraphQL.Field(_type => Course_tagWhereInput, {
    nullable: true
  })
  where?: Course_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_tagOrderByInput], {
    nullable: true
  })
  orderBy?: Course_tagOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_tagWhereUniqueInput, {
    nullable: true
  })
  cursor?: Course_tagWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Course_tagScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "identifier" | "name" | "category"> | undefined;
}
