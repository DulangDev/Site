import { Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import {Request} from 'express'
@Controller("vkapi")
export class VkapiController{
    constructor(private readonly appService: AppService) {}
    @Post()
    @HttpCode(200)
    get_api_key(@Req() request: Request):string{
      console.log(request.body)
      return "edb7907d"
    }
}
