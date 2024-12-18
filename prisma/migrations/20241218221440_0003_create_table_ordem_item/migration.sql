/*
  Warnings:

  - You are about to drop the column `isRemoved` on the `card_produtos` table. All the data in the column will be lost.
  - You are about to drop the `Receipt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_orderId_fkey";

-- AlterTable
ALTER TABLE "card_produtos" DROP COLUMN "isRemoved";

-- DropTable
DROP TABLE "Receipt";

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "produtoNome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id_order") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;
