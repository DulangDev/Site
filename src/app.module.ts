import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import {VkapiController} from './vkapi.controller';
import { doc } from 'prettier';
import join = doc.builders.join;

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/..`,
    }),
  ],
  controllers: [AppController, VkapiController],
  providers: [AppService],
})
export class AppModule {}
