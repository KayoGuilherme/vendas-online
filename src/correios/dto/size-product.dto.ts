import { CreateProductDto } from "src/Products/dto/create-product.dto";

export class SizeProductDTO {
  weight: number;
  length: number;
  height: number;
  width: number;
  diameter: number;
  productValue: number;

  constructor(product: CreateProductDto) {
    this.weight = product.weight;
    this.height = product.height;
    this.width = product.width;
    this.diameter = product.diameter;
    this.productValue = product.preco;
  }
}
