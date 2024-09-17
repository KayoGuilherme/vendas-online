import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';

export const User = createParamDecorator((_: unknown, context: ExecutionContext) => {

    const request = context.switchToHttp().getRequest()
    const user = request.user;

    if (user) {
        return request.user.id
    } else {
        throw new NotFoundException('Usuario nao encontrado no request. Use o AuthGuard para obter o usuario')
    }
});