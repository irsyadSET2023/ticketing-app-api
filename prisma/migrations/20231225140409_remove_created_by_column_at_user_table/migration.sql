/*
  Warnings:

  - You are about to drop the column `created_by` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_created_by_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "created_by";
