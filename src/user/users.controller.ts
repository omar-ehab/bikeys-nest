import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserDto } from './dtos/UserDto';
import { UsersService } from './users.service';
import { LoginDto } from './dtos/LoginDto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/auth/send_otp')
  async sendOtp(@Body() dto: UserDto) {
    const { mobile } = dto;
    const user = await this.userService.findOrCreate(mobile);
    await this.userService.sendOtp(user);
    return { message: 'OTP Sent Successfully' };
  }

  @Post('/auth/login')
  async login(@Body() dto: LoginDto) {
    const { mobile, otp } = dto;
    try {
      const user = await this.userService.findOrCreate(mobile);
      return await this.userService.validateOtp(user, otp);
    } catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: [e],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
