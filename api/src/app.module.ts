import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { MarkmapEntity } from './entities/markmap.entity';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import { render } from 'prettyjson';
import { APP_PIPE } from '@nestjs/core';
import { MarkmapModule } from './markmap/markmap.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'metalk',
      entities: [UserEntity, MarkmapEntity],
      synchronize: process.env.NODE_ENV === 'dev',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        stream: {
          write: (msg: string) => {
            console.log(render(JSON.parse(msg)));
          },
        },
      },
    }),
    UserModule,
    MarkmapModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
