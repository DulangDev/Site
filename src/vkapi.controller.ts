import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("vkapi")
export class VkapiController{
    constructor(private readonly appService: AppService) {}
    @Post()
    get_api_key():string{
      return "edb7907d"
    }
}
