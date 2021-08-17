import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LectureCreateManyInput } from "../../../inputs/LectureCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyLectureArgs {
  @TypeGraphQL.Field(_type => [LectureCreateManyInput], {
    nullable: false
  })
  data!: LectureCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
