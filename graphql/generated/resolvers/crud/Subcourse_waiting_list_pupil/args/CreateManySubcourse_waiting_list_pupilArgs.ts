import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_waiting_list_pupilCreateManyInput } from "../../../inputs/Subcourse_waiting_list_pupilCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManySubcourse_waiting_list_pupilArgs {
  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateManyInput], {
    nullable: false
  })
  data!: Subcourse_waiting_list_pupilCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
