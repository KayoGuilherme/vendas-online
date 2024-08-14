import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamId_produto = createParamDecorator((_data: unknown, context: ExecutionContext) => {
    return Number(context.switchToHttp().getRequest().params.id_produto)
});