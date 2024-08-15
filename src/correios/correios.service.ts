import { Injectable } from '@nestjs/common';
import { calcularPrecoPrazo } from 'correios-brasil';
import { ResponsePriceCorreios } from './dto/reponse-price-correios';
import { SizeProductDTO } from './dto/size-product.dto';
import { CdFormatEnum } from './enums/cd-formate.enum';

@Injectable()
export class CorreiosService {
  CEP_COMPANY = process.env.CEP_COMPANY;

  async priceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDTO,
  ): Promise<ResponsePriceCorreios> {
    return new Promise((resolve) => {
      const result = calcularPrecoPrazo({
        nCdServico: [cdService],
        sCepOrigem: this.CEP_COMPANY,
        sCepDestino: cep,
        nCdFormato: String(CdFormatEnum.BOX),
        nVlPeso: String(sizeProduct.weight),
        nVlComprimento: String(sizeProduct.length),
        nVlAltura: String(sizeProduct.height),
        nVlLargura: String(sizeProduct.width),
        nVlDiametro: String(sizeProduct.diameter),
        nCdEmpresa: '',
        sDsSenha: '',
        sCdMaoPropria: 'N',
        nVlValorDeclarado:
          sizeProduct.productValue < 25 ? 0 : sizeProduct.productValue,
        sCdAvisoRecebimento: 'N',
      });
    });
  }
}
