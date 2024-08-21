import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { SizeProductDTO } from './dto/size-product.dto';
import { CdFormatEnum } from './enums/cd-formate.enum';
import { response } from 'express';

@Injectable()
export class CorreiosService {
  private readonly CEP_COMPANY = process.env.CEP_COMPANY;
  private readonly API_URL = process.env.API_URL;
  private readonly API_URL_TOKEN = process.env.API_URL_TOKEN;
  private token: string = null;
  private tokenExpiration: number = null;

  private async refreshToken() {
    // try {
    //   const response = await axios.post(this.API_URL_TOKEN, {
    //     numero: process.env.NUMERO_CONTRATO, 
    //   });
    //   console.log(response.data.token)
    //   if (response.data) {
    //     this.token = response.data.token;
    //     this.tokenExpiration = new Date(response.data.expiraEm).getTime(); 
    //   } else {
    //     console.log()
    //     throw new Error('Token não retornado na resposta');
    //   }
    // } catch (error) {
    //   console.error('Erro ao autenticar com os Correios:');
    //   throw new BadRequestException('Erro ao autenticar com os Correios');
    // }

    try {
      const response = await fetch(this.API_URL_TOKEN, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          numero: process.env.NUMERO_CONTRATO
        })
      })

      if (!response.ok) {
        console.error('Erro na resposta da API:', response.status, response.statusText);
        throw new Error('Erro ao autenticar com os Correios');
      }

      const data: any = response.json();
      console.log('Resposta completa da API:', data);

      if (data && data.token) {
        this.token = data.token;
        this.tokenExpiration = new Date(data.expiraEm).getTime();
      } else {
        throw new Error('Token não retornado na resposta');
      }

    } catch (error) {
      console.error('Erro ao autenticar com os Correios:');
      throw new BadRequestException('Erro ao autenticar com os Correios');
    }

  }

  private async ensureValidToken() {
    if (!this.token || Date.now() >= this.tokenExpiration) {
      await this.refreshToken();
    }
  }



  async priceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDTO,
  ) {
    await this.ensureValidToken();

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
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Erro Configurando Requisição:', error);
      throw new BadRequestException(
        `Erro ao fazer a requisição: ${error.message}`,
      );
    }
  }
}
