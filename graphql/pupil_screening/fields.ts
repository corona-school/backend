import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Pupil, Pupil_screening as PupilScreening } from '../generated';
import { Role } from '../../common/user/roles';
import { prisma } from '../../common/prisma';

@Resolver((of) => PupilScreening)
export class ExtendedFieldsPupil_screeningResolver {
    @FieldResolver((returns) => Pupil)
    @Authorized(Role.ADMIN)
    async pupil(@Root() screening: PupilScreening) {
        return await prisma.pupil.findUnique({ where: { id: screening.pupilId } });
    }
}
