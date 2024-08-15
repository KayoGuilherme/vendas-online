import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { PrecoPrazoResponse } from 'correios-brasil/dist';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correiosService: CorreiosService) {}

  @Post()
  create(@Body() dados: PrecoPrazoResponse) {
    
  }

  }

