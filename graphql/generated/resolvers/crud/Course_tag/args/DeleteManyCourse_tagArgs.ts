import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagWhereInput } from "../../../inputs/Course_tagWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyCourse_tagArgs {
  @TypeGraphQL.Field(_type => Course_tagWhereInput, {
    nullable: true
  })
  where?: Course_tagWhereInput | undefined;
}
