import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosController } from './correios.controller';
import { CorreiosService } from './correios.service';

describe('CorreiosController', () => {
  let controller: CorreiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorreiosController],
      providers: [CorreiosService],
    }).compile();

    controller = module.get<CorreiosController>(CorreiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
