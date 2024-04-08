/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Vans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Vans` table. All the data in the column will be lost.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `vanId` was added to the `Vans` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Vans" DROP CONSTRAINT "Vans_hostId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "Vans" DROP CONSTRAINT "Vans_pkey",
DROP COLUMN "id",
ADD COLUMN     "vanId" TEXT NOT NULL,
ADD CONSTRAINT "Vans_pkey" PRIMARY KEY ("vanId");

-- AddForeignKey
ALTER TABLE "Vans" ADD CONSTRAINT "Vans_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
