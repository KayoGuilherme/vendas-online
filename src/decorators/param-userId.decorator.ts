import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamUserId = createParamDecorator((_data: unknown, context: ExecutionContext) => {
    return Number(context.switchToHttp().getRequest().params.userId)
});