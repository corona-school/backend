import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagOrderByWithRelationInput } from "../../../inputs/Course_tagOrderByWithRelationInput";
import { Course_tagWhereInput } from "../../../inputs/Course_tagWhereInput";
import { Course_tagWhereUniqueInput } from "../../../inputs/Course_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateCourse_tagArgs {
  @TypeGraphQL.Field(_type => Course_tagWhereInput, {
    nullable: true
  })
  where?: Course_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_tagOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Course_tagOrderByWithRelationInput[] | undefined;

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
}
