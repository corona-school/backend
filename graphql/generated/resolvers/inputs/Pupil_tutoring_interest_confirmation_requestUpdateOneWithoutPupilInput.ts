import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Pupil_tutoring_interest_confirmation_requestCreateOrConnectWithoutPupilInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestCreateOrConnectWithoutPupilInput";
import { Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput";
import { Pupil_tutoring_interest_confirmation_requestUpdateWithoutPupilInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestUpdateWithoutPupilInput";
import { Pupil_tutoring_interest_confirmation_requestUpsertWithoutPupilInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestUpsertWithoutPupilInput";
import { Pupil_tutoring_interest_confirmation_requestWhereUniqueInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestWhereUniqueInput";

@TypeGraphQL.InputType("Pupil_tutoring_interest_confirmation_requestUpdateOneWithoutPupilInput", {
  isAbstract: true
})
export class Pupil_tutoring_interest_confirmation_requestUpdateOneWithoutPupilInput {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput, {
    nullable: true
  })
  create?: Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestCreateOrConnectWithoutPupilInput, {
    nullable: true
  })
  connectOrCreate?: Pupil_tutoring_interest_confirmation_requestCreateOrConnectWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestUpsertWithoutPupilInput, {
    nullable: true
  })
  upsert?: Pupil_tutoring_interest_confirmation_requestUpsertWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereUniqueInput, {
    nullable: true
  })
  connect?: Pupil_tutoring_interest_confirmation_requestWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestUpdateWithoutPupilInput, {
    nullable: true
  })
  update?: Pupil_tutoring_interest_confirmation_requestUpdateWithoutPupilInput | undefined;
}
