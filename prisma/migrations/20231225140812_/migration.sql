/*
  Warnings:

  - A unique constraint covering the columns `[api_key]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Organization_api_key_key" ON "Organization"("api_key");
