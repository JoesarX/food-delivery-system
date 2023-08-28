-- CreateTable
CREATE TABLE "ProductSizes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "ingridients" JSONB[],
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductSizes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductSizes" ADD CONSTRAINT "ProductSizes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
