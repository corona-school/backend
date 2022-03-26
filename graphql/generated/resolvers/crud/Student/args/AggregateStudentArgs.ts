import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { StudentOrderByInput } from "../../../inputs/StudentOrderByInput";
import { StudentWhereInput } from "../../../inputs/StudentWhereInput";
import { StudentWhereUniqueInput } from "../../../inputs/StudentWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateStudentArgs {
  @TypeGraphQL.Field(_type => StudentWhereInput, {
    nullable: true
  })
  where?: StudentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [StudentOrderByInput], {
    nullable: true
  })
  orderBy?: StudentOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  cursor?: StudentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
