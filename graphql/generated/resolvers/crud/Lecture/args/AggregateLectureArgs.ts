import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LectureOrderByWithRelationInput } from "../../../inputs/LectureOrderByWithRelationInput";
import { LectureWhereInput } from "../../../inputs/LectureWhereInput";
import { LectureWhereUniqueInput } from "../../../inputs/LectureWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateLectureArgs {
  @TypeGraphQL.Field(_type => LectureWhereInput, {
    nullable: true
  })
  where?: LectureWhereInput | undefined;

  @TypeGraphQL.Field(_type => [LectureOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: LectureOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: true
  })
  cursor?: LectureWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
