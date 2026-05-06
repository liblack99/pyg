/*
  Warnings:

  - You are about to drop the column `mobilePhone` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "mobilePhone",
ADD COLUMN     "phone" TEXT;
