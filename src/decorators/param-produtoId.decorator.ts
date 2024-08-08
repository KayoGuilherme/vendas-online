import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamProdutoId = createParamDecorator((_data: unknown, context: ExecutionContext) => {
    return Number(context.switchToHttp().getRequest().params.produtoId)
});