import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilOrderByInput } from "../../../inputs/PupilOrderByInput";
import { PupilWhereInput } from "../../../inputs/PupilWhereInput";
import { PupilWhereUniqueInput } from "../../../inputs/PupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregatePupilArgs {
  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  where?: PupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => [PupilOrderByInput], {
    nullable: true
  })
  orderBy?: PupilOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  cursor?: PupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
