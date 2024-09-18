import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";
import { SizeProductDTO } from "./dto/size-product.dto";
import { CdFormatEnum } from "./enums/cd-formate.enum";


@Injectable()
export class CorreiosService {
  private readonly CEP_COMPANY = process.env.CEP_COMPANY;
  private readonly API_URL = process.env.API_URL;
  private readonly API_URL_TOKEN = process.env.API_URL_TOKEN;
  private token: string = null;
  private tokenExpiration: number = null;


  private async refreshToken() {
    try {
      const username = process.env.USUARIO_CORREIOS;  // Seu CNPJ
      const password = process.env.tokenCorreios;
      const auth = Buffer.from(`${username}:${password}`).toString("base64");

      const response = await axios.post(
        this.API_URL_TOKEN,
        {
          numero: process.env.CARTAO_POSTAGEM,
          contrato: process.env.NUMERO_CONTRATO,
          dr: 12
        },
        {
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      if (response.data && response.data.token) {
        this.token = response.data.token;
        this.tokenExpiration = new Date(response.data.expiraEm).getTime();
      } else {
        throw new Error("Token não retornado na resposta");
      }
    } catch (error) {
      console.error("Erro ao autenticar com os Correios:", error.response?.data || error.message);
      if (error.response && error.response.status === 403) {
        throw new BadRequestException("Erro de permissão com os Correios. Verifique o contrato e permissões.");
      }
      throw new BadRequestException("Erro ao autenticar com os Correios");
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
    sizeProduct: SizeProductDTO
  ) {
    await this.ensureValidToken();
    try {
      const response = await axios.post(
        this.API_URL,
        {
          idLote: "1234567890",
          parametrosProduto: [
            {
              coProduto: "04162",
              nuRequisicao: "12345",
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
              cdEmpresa: "",
              dsSenha: "",
              cdMaoPropria: "N",
              vlValorDeclarado:
                sizeProduct.productValue < 25 ? 0 : sizeProduct.productValue,
              cdAvisoRecebimento: "N"
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro Configurando Requisição:", error);
      throw new BadRequestException(
        `Erro ao fazer a requisição: ${error.message}`
      );
    }
  }
}
