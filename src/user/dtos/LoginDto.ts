import { Min, Max, Matches } from 'class-validator';

export class LoginDto {
  @Min(1000, { message: 'Incorrect OTP' })
  @Max(9999, { message: 'Incorrect OTP' })
  otp: number;

  @Matches(/(01)(0|1|2|5)\d{8}/, { message: 'Incorrect Mobile Number' })
  mobile: string;
}
