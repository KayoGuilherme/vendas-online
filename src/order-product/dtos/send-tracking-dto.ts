import { ApiProperty } from "@nestjs/swagger";
import { IsString} from "class-validator";

export class SendtrackingDto {
    @ApiProperty()
    @IsString()
    trackingCode: string
}