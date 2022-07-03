import { Matches } from 'class-validator';

export class UserDto {
  @Matches(/(01)(0|1|2|5)\d{8}/, { message: 'Incorrect Mobile Number' })
  mobile: string;
}
