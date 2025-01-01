import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import express from 'express';
import path from 'path';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mw as requestIpMw } from 'request-ip';
import { ValidationPipe } from '@nestjs/common';

import { logger } from './common/libs/log4js/logger.middleware';
import { TransformInterceptor } from './common/libs/log4js/transform.interceptor';
import { ExceptionsFilter } from './common/libs/log4js/exceptions-filter';
import { HttpExceptionsFilter } from './common/libs/log4js/http-exceptions-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15분
      max: 1000, // 15분 동안 최대 1000회까지만 접속이 가능합니다.
    }),
  );

  const config = app.get(ConfigService);

  // 설정 api 접근 접두사
  const prefix = config.get<string>('app.prefix');
  app.setGlobalPrefix(prefix);

  // web 보안, 흔한 취약점 방지
  // 메모: 개발 환경 nest static module을 켜려면 crossOriginResourcePolicy를 false로 설정해야 합니다. 그렇지 않으면 정적 자원에 대한 접근을 허용하지 않습니다.
  // { crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, crossOriginResourcePolicy: false }
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
    }),
  );

  // swagger 설정
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Nest-Admin App')
    .setDescription('Nest-Admin App 接口文档')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);

  // 항목은 현재 문서 기능에 의존하므로 현재 주소를 변경하지 않는 것이 좋습니다
  // 생산 환경에서 nginx를 사용하면 현재 문서 주소를 외부 접근을 차단할 수 있습니다
  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Nest-Admin API Docs',
  });

  // 실제 가져오기 ip
  app.use(requestIpMw({ attributeName: 'ip' }));

  // 전역 검증
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true, // 开发环境
      disableErrorMessages: false,
      forbidUnknownValues: false,
    }),
  );

  // 로그
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);

  // 전역 차단기를 사용하여 참조 출력하기
  app.useGlobalInterceptors(new TransformInterceptor());

  // 모든 이상
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionsFilter());

  // 설정 포트 가져오기
  const port = config.get<number>('app.port') || 8080;
  await app.listen(port);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
