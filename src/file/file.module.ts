import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { PrismaClient } from "@prisma/client";




@Module({
    providers: [FileService, PrismaClient],
    exports: [FileService]
})

export class FileModule { }
