import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { ResponsePriceCorreios } from './dto/reponse-price-correios';
import { SizeProductDTO } from './dto/size-product.dto';
import { CdFormatEnum } from './enums/cd-formate.enum';

@Injectable()
export class CorreiosService {
  private readonly CEP_COMPANY = process.env.CEP_COMPANY;
  private readonly API_URL = 'https://api.correios.com.br/preco/v1/nacional';
  private readonly API_TOKEN = process.env.API_TOKEN;

  async priceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDTO,
  ) {
    try {
      const response = await axios.post(
        this.API_URL,
        {
          idLote: '1234567890',
          parametrosProduto: [
            {
              coProduto: '04162',
              nuRequisicao: '12345',
              cdServico: cdService,
              cepOrigem: this.CEP_COMPANY,
              cepDestino: cep,
              cdFormato: CdFormatEnum.BOX,
              vlPeso: sizeProduct.weight,
              vlComprimento: sizeProduct.length,
              vlAltura: sizeProduct.height,
              vlLargura: sizeProduct.width,
              vlDiametro: sizeProduct.diameter,
              psObjeto: sizeProduct.weight.toString(),
              cdEmpresa: '',
              dsSenha: '',
              cdMaoPropria: 'N',
              vlValorDeclarado:
                sizeProduct.productValue < 25 ? 0 : sizeProduct.productValue,
              cdAvisoRecebimento: 'N',
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.API_TOKEN}`,
          },
        },
      );
    } catch (error) {
      console.error('Error Configurando Requisição:', error.message);
      throw new BadRequestException(
        `Erro ao fazer a requisição: ${error.message}`,
      );
    }
  }
}
