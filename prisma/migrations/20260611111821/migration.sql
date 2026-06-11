/*
  Warnings:

  - A unique constraint covering the columns `[productId,warehouseId]` on the table `WarehouseStocks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "WarehouseStocks_productId_key";

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseStocks_productId_warehouseId_key" ON "WarehouseStocks"("productId", "warehouseId");
