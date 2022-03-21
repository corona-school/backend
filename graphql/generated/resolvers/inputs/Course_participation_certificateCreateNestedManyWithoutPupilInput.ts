import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateCreateManyPupilInputEnvelope } from "../inputs/Course_participation_certificateCreateManyPupilInputEnvelope";
import { Course_participation_certificateCreateOrConnectWithoutPupilInput } from "../inputs/Course_participation_certificateCreateOrConnectWithoutPupilInput";
import { Course_participation_certificateCreateWithoutPupilInput } from "../inputs/Course_participation_certificateCreateWithoutPupilInput";
import { Course_participation_certificateWhereUniqueInput } from "../inputs/Course_participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Course_participation_certificateCreateNestedManyWithoutPupilInput", {
  isAbstract: true
})
export class Course_participation_certificateCreateNestedManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Course_participation_certificateCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Course_participation_certificateCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Course_participation_certificateCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_participation_certificateWhereUniqueInput[] | undefined;
}
