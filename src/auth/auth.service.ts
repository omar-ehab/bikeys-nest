import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../user/users.schema';
import { tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: UserDocument): Promise<tokens> {
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
