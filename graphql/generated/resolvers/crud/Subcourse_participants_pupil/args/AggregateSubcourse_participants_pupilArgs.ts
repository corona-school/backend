import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_participants_pupilOrderByInput } from "../../../inputs/Subcourse_participants_pupilOrderByInput";
import { Subcourse_participants_pupilWhereInput } from "../../../inputs/Subcourse_participants_pupilWhereInput";
import { Subcourse_participants_pupilWhereUniqueInput } from "../../../inputs/Subcourse_participants_pupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateSubcourse_participants_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereInput, {
    nullable: true
  })
  where?: Subcourse_participants_pupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilOrderByInput], {
    nullable: true
  })
  orderBy?: Subcourse_participants_pupilOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereUniqueInput, {
    nullable: true
  })
  cursor?: Subcourse_participants_pupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
