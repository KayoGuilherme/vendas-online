import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaModule } from './database/prisma.module';
import { ProductModule } from './Products/Products.module';
import { CartProductModule } from './cartProduct/cart_product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryProductModule } from './CategoryProduct/category.module';
import { AdressModule } from './Adress/adress.module';
import { FileModule } from './file/file.module';
import { PaymentModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order-product/order.module';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { WebHooksModule } from './Webhooks/webhooks.module';
import { ProfitModule } from './profit/profit.module';
import { CorreiosModule } from './correios/correios.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'node_modules', 'swagger-ui-dist'),
      serveRoot: 'swagger',
    }),
    CartProductModule,
    CartModule,
    ProductModule,
    PrismaModule,
    CategoryProductModule,
    AdressModule,
    PaymentModule,
    FileModule,
    OrderModule,
    WebHooksModule,
    forwardRef(() => AuthModule),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_MAILER,
          pass: process.env.PASS_MAILER,
        },
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ProfitModule,
    CorreiosModule,
  ],
})
export class AppModule {}
