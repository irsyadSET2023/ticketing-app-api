/*
  Warnings:

  - You are about to drop the column `developer_remarks` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "developer_remarks";

-- AlterTable
ALTER TABLE "UserAssignedTicket" ADD COLUMN     "remarks" TEXT;
