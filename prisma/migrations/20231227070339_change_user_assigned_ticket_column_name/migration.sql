/*
  Warnings:

  - You are about to drop the column `assigned_ticket_id` on the `UserAssignedTicket` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserAssignedTicket` table. All the data in the column will be lost.
  - Added the required column `ticket_id` to the `UserAssignedTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserAssignedTicket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAssignedTicket" DROP CONSTRAINT "UserAssignedTicket_assigned_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "UserAssignedTicket" DROP CONSTRAINT "UserAssignedTicket_userId_fkey";

-- AlterTable
ALTER TABLE "UserAssignedTicket" DROP COLUMN "assigned_ticket_id",
DROP COLUMN "userId",
ADD COLUMN     "ticket_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserAssignedTicket" ADD CONSTRAINT "UserAssignedTicket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignedTicket" ADD CONSTRAINT "UserAssignedTicket_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
