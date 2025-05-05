-- AlterEnum
ALTER TYPE "secret_type_enum" ADD VALUE 'IDP';

-- AlterTable
ALTER TABLE "secret" ADD COLUMN     "idpClientId" VARCHAR;
