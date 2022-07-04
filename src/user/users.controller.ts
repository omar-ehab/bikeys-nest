import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LoginRequestDto } from './dtos/LoginRequestDto';
import { UsersService } from './users.service';
import { VerifyingRequestDto } from './dtos/VerifyingRequestDto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dtos/UserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/auth/send_otp')
  async sendOtp(@Body() dto: LoginRequestDto) {
    const { mobile } = dto;
    const user = await this.userService.findOrCreate(mobile);
    await this.userService.sendOtp(user);
    return { message: 'OTP Sent Successfully' };
  }

  @Post('/auth/login')
  async login(@Body() dto: VerifyingRequestDto) {
    const { mobile, otp } = dto;
    try {
      const user = await this.userService.findOrCreate(mobile);
      return await this.userService.validateOtp(user.mobile, otp);
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async profile(@Request() req): Promise<UserDto> {
    return await this.userService.findOne(req.user.mobile);
  }
}
