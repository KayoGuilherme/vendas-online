-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(125) NOT NULL,
    "email" VARCHAR(125) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "Telefone" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produtos" (
    "id_produto" SERIAL NOT NULL,
    "nome_produto" VARCHAR(125) NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "descricao" VARCHAR(125) NOT NULL,
    "estoque" INTEGER NOT NULL,
    "oferta" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Produtos_pkey" PRIMARY KEY ("id_produto")
);

-- CreateTable
CREATE TABLE "ImageProduto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "ImageProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_produtos" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "card_produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id_order" SERIAL NOT NULL,
    "cart_Id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "adressId" INTEGER NOT NULL,
    "Delivered" BOOLEAN DEFAULT false,
    "trackingCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id_order")
);

-- CreateTable
CREATE TABLE "Adress" (
    "id" SERIAL NOT NULL,
    "CEP" TEXT NOT NULL,
    "numero" TEXT,
    "complemento" TEXT NOT NULL,
    "ponto_de_referencia" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "telefone_contato" TEXT NOT NULL,
    "Rua" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Adress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profit" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_Telefone_key" ON "users"("Telefone");

-- CreateIndex
CREATE UNIQUE INDEX "users_CPF_key" ON "users"("CPF");

-- AddForeignKey
ALTER TABLE "Produtos" ADD CONSTRAINT "Produtos_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageProduto" ADD CONSTRAINT "ImageProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_produtos" ADD CONSTRAINT "card_produtos_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_produtos" ADD CONSTRAINT "card_produtos_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cart_Id_fkey" FOREIGN KEY ("cart_Id") REFERENCES "card_produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_adressId_fkey" FOREIGN KEY ("adressId") REFERENCES "Adress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adress" ADD CONSTRAINT "Adress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
