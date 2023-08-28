/*
  Warnings:

  - You are about to drop the `ProductSizes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductSizes" DROP CONSTRAINT "ProductSizes_productId_fkey";

-- DropTable
DROP TABLE "ProductSizes";
