import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutMatchInput } from "../inputs/PupilCreateOrConnectWithoutMatchInput";
import { PupilCreateWithoutMatchInput } from "../inputs/PupilCreateWithoutMatchInput";
import { PupilUpdateWithoutMatchInput } from "../inputs/PupilUpdateWithoutMatchInput";
import { PupilUpsertWithoutMatchInput } from "../inputs/PupilUpsertWithoutMatchInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilUpdateOneWithoutMatchInput", {
  isAbstract: true
})
export class PupilUpdateOneWithoutMatchInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutMatchInput, {
    nullable: true
  })
  create?: PupilCreateWithoutMatchInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutMatchInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutMatchInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpsertWithoutMatchInput, {
    nullable: true
  })
  upsert?: PupilUpsertWithoutMatchInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateWithoutMatchInput, {
    nullable: true
  })
  update?: PupilUpdateWithoutMatchInput | undefined;
}
