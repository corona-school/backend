import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateNestedOneWithoutProject_matchInput } from "../inputs/PupilCreateNestedOneWithoutProject_matchInput";
import { StudentCreateNestedOneWithoutProject_matchInput } from "../inputs/StudentCreateNestedOneWithoutProject_matchInput";

@TypeGraphQL.InputType("Project_matchCreateInput", {
  isAbstract: true
})
export class Project_matchCreateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  dissolved?: boolean | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  dissolveReason?: number | undefined;

  @TypeGraphQL.Field(_type => PupilCreateNestedOneWithoutProject_matchInput, {
    nullable: true
  })
  pupil?: PupilCreateNestedOneWithoutProject_matchInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutProject_matchInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutProject_matchInput | undefined;
}
