import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamAddresId = createParamDecorator((_data: unknown, context: ExecutionContext) => {
    return Number(context.switchToHttp().getRequest().params.selectedAdressId)
});