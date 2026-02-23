-- CreateEnum
CREATE TYPE "student_jobstatus_enum" AS ENUM ('Student', 'Pupil', 'Employee', 'Retiree', 'Misc', 'Azubi');

-- CreateEnum
CREATE TYPE "student_education_experience_enum" AS ENUM ('teacher', 'specialEducationTeacher', 'earlyChildhoodEducator', 'socialWorker', 'childAndAdolescentPsychologist', 'other');

-- CreateEnum
CREATE TYPE "student_experience_level_enum" AS ENUM ('none', 'some', 'extensive');

-- CreateEnum
CREATE TYPE "student_special_experience_enum" AS ENUM ('daz', 'adhd', 'dyslexia', 'dyscalculia', 'autismSpectrumDisorder', 'emotionalAndSocialDevelopment', 'giftedness', 'visualImpairment', 'hearingImpairment', 'traumaSensitivePedagogy', 'other');

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "experience" JSON,
ADD COLUMN     "jobStatus" "student_jobstatus_enum";
