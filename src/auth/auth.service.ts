import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { tokens } from './types';
import { UserDto } from '../user/dtos/UserDto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: UserDto): Promise<tokens> {
    const payload = { _id: user._id, mobile: user.mobile };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '1y',
      }),
    };
  }

  async refresh(refresh_token: string) {
    const payload = this.jwtService.decode(refresh_token);
    return {
      access_token: this.jwtService.sign(payload),
    };
    // if (payload._id === user._id && payload.mobile === user.mobile) {
    //   return {
    //     access_token: this.jwtService.sign({
    //       _id: user._id,
    //       mobile: user.mobile,
    //     }),
    // };
    // }
    // return null;
  }
}
