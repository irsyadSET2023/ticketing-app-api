-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_validate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token" TEXT;
