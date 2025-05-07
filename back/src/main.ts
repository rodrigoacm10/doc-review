import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // ou porta do seu front
    credentials: true, // necessário se estiver usando cookies ou sessões
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
