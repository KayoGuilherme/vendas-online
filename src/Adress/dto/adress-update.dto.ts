import { PartialType } from "@nestjs/swagger";
import { AdressDTO } from "./adress-create.dto";

export class AdressUpdateDTO extends PartialType(AdressDTO) {}