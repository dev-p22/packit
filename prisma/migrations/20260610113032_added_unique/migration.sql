/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productId]` on the table `UserCart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserCart_cartId_productId_key" ON "UserCart"("cartId", "productId");
