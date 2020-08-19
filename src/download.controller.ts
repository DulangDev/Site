import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'fs';
@Controller("download")
export class DownloadController{
  constructor(private readonly appService: AppService) {}
  @Get()
  download_page():string{
    return readFileSync(__dirname+"/../static/docker.html").toString()
  }
}
