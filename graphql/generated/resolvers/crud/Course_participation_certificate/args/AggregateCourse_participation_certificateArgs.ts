import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateOrderByInput } from "../../../inputs/Course_participation_certificateOrderByInput";
import { Course_participation_certificateWhereInput } from "../../../inputs/Course_participation_certificateWhereInput";
import { Course_participation_certificateWhereUniqueInput } from "../../../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereInput, {
    nullable: true
  })
  where?: Course_participation_certificateWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateOrderByInput], {
    nullable: true
  })
  orderBy?: Course_participation_certificateOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateWhereUniqueInput, {
    nullable: true
  })
  cursor?: Course_participation_certificateWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
