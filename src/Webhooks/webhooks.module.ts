import { Module } from "@nestjs/common";
import { WebhookController } from "./CreateOrder-webhook";
import { PrismaService } from "src/database/prisma.service";
import { ProductModule } from "src/Products/Products.module";


@Module({
    imports: [ProductModule],
    controllers: [WebhookController],
    providers: [PrismaService]
})

export class WebHooksModule{}