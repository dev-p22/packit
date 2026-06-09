/*
  Warnings:

  - Added the required column `sellerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WarehouseStocks" DROP CONSTRAINT "WarehouseStocks_productId_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseStocks" DROP CONSTRAINT "WarehouseStocks_warehouseId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sellerId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseStocks" ADD CONSTRAINT "WarehouseStocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseStocks" ADD CONSTRAINT "WarehouseStocks_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
