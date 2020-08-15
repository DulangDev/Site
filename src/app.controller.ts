import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  basicPage(): string {
    try{
      return fs.readFileSync(__dirname+"/../static/index.html").toString()
    } catch (e) {
      return "error occured"
    }
  }


}
