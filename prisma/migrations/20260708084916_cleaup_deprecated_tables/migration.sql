/*
  Warnings:

  - You are about to drop the `bbb_meeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_attendance_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_guest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_participation_certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jufo_verification_transmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "course_attendance_log" DROP CONSTRAINT "FK_927959c3480126ecdceeae26609";

-- DropForeignKey
ALTER TABLE "course_attendance_log" DROP CONSTRAINT "FK_acc59dc4321a888376f7fad5a3d";

-- DropForeignKey
ALTER TABLE "course_guest" DROP CONSTRAINT "FK_4392726b6462358a809db822af4";

-- DropForeignKey
ALTER TABLE "course_guest" DROP CONSTRAINT "FK_a0843258a46daa7d91dc2cef917";

-- DropForeignKey
ALTER TABLE "course_participation_certificate" DROP CONSTRAINT "FK_585aa209315fc328d48af2765b4";

-- DropForeignKey
ALTER TABLE "course_participation_certificate" DROP CONSTRAINT "FK_bc6a26ac82132b6e9f1d6de3e4c";

-- DropForeignKey
ALTER TABLE "course_participation_certificate" DROP CONSTRAINT "FK_d03c3421018dd300f5e9061ae87";

-- DropForeignKey
ALTER TABLE "jufo_verification_transmission" DROP CONSTRAINT "FK_1ceddec34e7b90cdbb85ff9738f";

-- DropTable
DROP TABLE "bbb_meeting";

-- DropTable
DROP TABLE "course_attendance_log";

-- DropTable
DROP TABLE "course_guest";

-- DropTable
DROP TABLE "course_participation_certificate";

-- DropTable
DROP TABLE "jufo_verification_transmission";
