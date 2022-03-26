import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Instructor_screeningOrderByInput } from "../../../inputs/Instructor_screeningOrderByInput";
import { Instructor_screeningWhereInput } from "../../../inputs/Instructor_screeningWhereInput";
import { Instructor_screeningWhereUniqueInput } from "../../../inputs/Instructor_screeningWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateInstructor_screeningArgs {
  @TypeGraphQL.Field(_type => Instructor_screeningWhereInput, {
    nullable: true
  })
  where?: Instructor_screeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningOrderByInput], {
    nullable: true
  })
  orderBy?: Instructor_screeningOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningWhereUniqueInput, {
    nullable: true
  })
  cursor?: Instructor_screeningWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
