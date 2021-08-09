import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_instructors_studentUpdateManyMutationInput } from "../../../inputs/Course_instructors_studentUpdateManyMutationInput";
import { Course_instructors_studentWhereInput } from "../../../inputs/Course_instructors_studentWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyCourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Course_instructors_studentUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_instructors_studentUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Course_instructors_studentWhereInput, {
    nullable: true
  })
  where?: Course_instructors_studentWhereInput | undefined;
}
