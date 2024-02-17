import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateIf,
} from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'test@mail.com',
  })
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '+79876543210',
  })
  @ValidateIf((o) => !o.email)
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  password?: string;
}
