import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
const httpsOptions = {
  key: readFileSync('/etc/letsencrypt/live/dulang.dev/privkey.pem'),
  cert: readFileSync('/etc/letsencrypt/live/dulang.dev/fullchain.pem'),
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {httpsOptions});

  await app.listen(443);

}
bootstrap();
