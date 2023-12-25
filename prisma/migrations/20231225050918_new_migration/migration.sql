/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `assignedTicketId` on the `UserAssignedTicket` table. All the data in the column will be lost.
  - You are about to drop the `UserCreateTicket` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assigned_ticket_id` to the `UserAssignedTicket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserAssignedTicket" DROP CONSTRAINT "UserAssignedTicket_assignedTicketId_fkey";

-- DropForeignKey
ALTER TABLE "UserCreateTicket" DROP CONSTRAINT "UserCreateTicket_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "UserCreateTicket" DROP CONSTRAINT "UserCreateTicket_userId_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "organizationId",
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "organization_id" INTEGER;

-- AlterTable
ALTER TABLE "UserAssignedTicket" DROP COLUMN "assignedTicketId",
ADD COLUMN     "assigned_ticket_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserCreateTicket";

-- RenameForeignKey
ALTER TABLE "User" RENAME CONSTRAINT "User_organizationId_fkey" TO "User_organization_id_fkey";

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignedTicket" ADD CONSTRAINT "UserAssignedTicket_assigned_ticket_id_fkey" FOREIGN KEY ("assigned_ticket_id") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
