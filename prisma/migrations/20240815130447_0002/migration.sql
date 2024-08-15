/*
  Warnings:

  - The `diameter` column on the `Produtos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `height` column on the `Produtos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `weight` column on the `Produtos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `width` column on the `Produtos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Produtos" DROP COLUMN "diameter",
ADD COLUMN     "diameter" INTEGER,
DROP COLUMN "height",
ADD COLUMN     "height" INTEGER,
DROP COLUMN "weight",
ADD COLUMN     "weight" INTEGER,
DROP COLUMN "width",
ADD COLUMN     "width" INTEGER;
