import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilOrderByWithRelationInput } from "../../../inputs/PupilOrderByWithRelationInput";
import { PupilWhereInput } from "../../../inputs/PupilWhereInput";
import { PupilWhereUniqueInput } from "../../../inputs/PupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregatePupilArgs {
  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  where?: PupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => [PupilOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: PupilOrderByWithRelationInput[] | undefined;

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
