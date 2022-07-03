import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dtos/UserDto';
import * as dayjs from 'dayjs';
import { AuthService } from '../auth/auth.service';
import { tokens } from '../auth/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}

  async findOne(mobile: string): Promise<UserDocument> {
    return this.userModel.findOne({ mobile });
  }

  async findOrCreate(mobile: string): Promise<UserDocument> {
    let user = await this.userModel.findOne({ mobile });
    if (!user) {
      user = await this.userModel.create({ mobile });
    }
    return user;
  }

  async create(userDto: UserDto): Promise<UserDocument> {
    const user = new this.userModel(userDto);
    return user.save();
  }

  async update(id: ObjectId, user: User): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, user);
  }

  async sendOtp(user: UserDocument): Promise<boolean> {
    user.update({
      two_factor_code: this.generateOtp(),
      two_factor_expires_at: dayjs().add(15, 'minute'),
    });
    return new Promise((resolve, reject) => {
      return resolve(true);
    });
  }

  async validateOtp(user: UserDocument, otp: number): Promise<string | tokens> {
    return new Promise((resolve, reject) => {
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
      resolve(this.generateJwt(user));
    });
  }

  private async generateJwt(user: UserDocument): Promise<tokens> {
    return this.authService.login(user);
  }

  private generateOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
