import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => !o.email)
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  weight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  height?: number;
}
