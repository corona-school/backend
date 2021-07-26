import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_participants_pupilCreateManyInput } from "../../../inputs/Subcourse_participants_pupilCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManySubcourse_participants_pupilArgs {
  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilCreateManyInput], {
    nullable: false
  })
  data!: Subcourse_participants_pupilCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
