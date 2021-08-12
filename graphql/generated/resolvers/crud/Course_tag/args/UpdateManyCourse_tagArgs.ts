import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagUpdateManyMutationInput } from "../../../inputs/Course_tagUpdateManyMutationInput";
import { Course_tagWhereInput } from "../../../inputs/Course_tagWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyCourse_tagArgs {
  @TypeGraphQL.Field(_type => Course_tagUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_tagUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Course_tagWhereInput, {
    nullable: true
  })
  where?: Course_tagWhereInput | undefined;
}
