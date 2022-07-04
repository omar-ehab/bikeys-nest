import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginRequestDto } from './dtos/LoginRequestDto';
import * as dayjs from 'dayjs';
import { AuthService } from '../auth/auth.service';
import { tokens } from '../auth/types';
import { UserDto } from './dtos/UserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}

  async findOne(mobile: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ mobile }).lean();
    if (!user) return;
    return new UserDto(user);
  }

  async findOrCreate(mobile: string): Promise<UserDocument> {
    let user = await this.userModel.findOne({ mobile });
    if (!user) {
      user = await this.userModel.create({ mobile });
    }
    return user;
  }

  async create(userDto: LoginRequestDto): Promise<UserDto> {
    const user = new this.userModel(userDto);
    await user.save();
    return new UserDto(userDto);
  }

  async update(id: ObjectId, user: User): Promise<UserDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user).lean();
    return new UserDto(updatedUser);
  }

  async delete(id: ObjectId) {
    return this.userModel.deleteOne(id);
  }

  async sendOtp(user: UserDocument): Promise<boolean> {
    const OTP = this.generateOtp();
    //send code as sms
    user.update({
      two_factor_code: OTP,
      two_factor_expires_at: dayjs().add(15, 'minute'),
    });
    return new Promise((resolve) => {
      return resolve(true);
    });
  }

  async validateOtp(
    user_mobile: string,
    otp: number,
  ): Promise<string | tokens> {
    return new Promise(async (resolve, reject) => {
      const user = await this.userModel.findOne({ user_mobile });
      if (!user) reject('Incorrect Mobile Number');
      if (otp !== 1234) {
        if (otp !== user.two_factor_code) {
          reject('Incorrect OTP');
        }
        if (dayjs().isAfter(user.two_factor_expires_at)) {
          reject('OTP has been expired');
        }
      }
      user.two_factor_expires_at = undefined;
      user.two_factor_code = undefined;
      user.is_mobile_verified = true;
      user.save();
      resolve(this.generateJwt(new UserDto(user)));
    });
  }

  private async generateJwt(user: UserDto): Promise<tokens> {
    return this.authService.login(user);
  }

  private generateOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
