import { Module } from "@nestjs/common";
import { WebhookController } from "./CreateOrder-webhook";
import { PrismaService } from "src/database/prisma.service";


@Module({
    controllers: [WebhookController],
    providers: [PrismaService]
})

export class WebHooksModule{}