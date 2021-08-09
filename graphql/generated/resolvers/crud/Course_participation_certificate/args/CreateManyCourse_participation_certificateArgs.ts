import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateCreateManyInput } from "../../../inputs/Course_participation_certificateCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateManyInput], {
    nullable: false
  })
  data!: Course_participation_certificateCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
