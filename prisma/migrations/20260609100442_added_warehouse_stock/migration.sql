-- CreateTable
CREATE TABLE "WarehouseStocks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "WarehouseStocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WarehouseStocks_warehouseId_idx" ON "WarehouseStocks"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseStocks_productId_key" ON "WarehouseStocks"("productId");

-- AddForeignKey
ALTER TABLE "WarehouseStocks" ADD CONSTRAINT "WarehouseStocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseStocks" ADD CONSTRAINT "WarehouseStocks_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
