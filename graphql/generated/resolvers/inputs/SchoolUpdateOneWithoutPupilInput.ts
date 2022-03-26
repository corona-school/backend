import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SchoolCreateOrConnectWithoutPupilInput } from "../inputs/SchoolCreateOrConnectWithoutPupilInput";
import { SchoolCreateWithoutPupilInput } from "../inputs/SchoolCreateWithoutPupilInput";
import { SchoolUpdateWithoutPupilInput } from "../inputs/SchoolUpdateWithoutPupilInput";
import { SchoolUpsertWithoutPupilInput } from "../inputs/SchoolUpsertWithoutPupilInput";
import { SchoolWhereUniqueInput } from "../inputs/SchoolWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SchoolUpdateOneWithoutPupilInput {
  @TypeGraphQL.Field(_type => SchoolCreateWithoutPupilInput, {
    nullable: true
  })
  create?: SchoolCreateWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => SchoolCreateOrConnectWithoutPupilInput, {
    nullable: true
  })
  connectOrCreate?: SchoolCreateOrConnectWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => SchoolUpsertWithoutPupilInput, {
    nullable: true
  })
  upsert?: SchoolUpsertWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => SchoolWhereUniqueInput, {
    nullable: true
  })
  connect?: SchoolWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => SchoolUpdateWithoutPupilInput, {
    nullable: true
  })
  update?: SchoolUpdateWithoutPupilInput | undefined;
}
