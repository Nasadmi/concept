import {
  Controller,
  Options,
  HttpException,
  HttpStatus,
  Header,
} from '@nestjs/common';

@Controller()
export class AppController {
  @Options('*')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type, Bearer')
  handleOptions() {
    throw new HttpException('', HttpStatus.OK);
  }
}
