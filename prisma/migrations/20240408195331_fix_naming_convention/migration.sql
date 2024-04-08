/*
  Warnings:

  - You are about to drop the `Vans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vans" DROP CONSTRAINT "Vans_hostId_fkey";

-- DropTable
DROP TABLE "Vans";

-- CreateTable
CREATE TABLE "Van" (
    "vanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Van_pkey" PRIMARY KEY ("vanId")
);

-- AddForeignKey
ALTER TABLE "Van" ADD CONSTRAINT "Van_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
