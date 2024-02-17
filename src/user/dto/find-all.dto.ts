import {
  IsOptional,
  IsPositive,
  ValidateBy,
  ValidationArguments,
  isDateString,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

interface Range<T> {
  lte?: T;
  gte?: T;
}

export class FindAllDto {
  @ApiProperty({
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsPositive()
  @IsOptional()
  page: number;

  @ApiProperty({
    example: 10,
    default: 10,
    minimum: 1,
    required: false,
  })
  @IsPositive()
  @IsOptional()
  pageSize: number;

  @ApiProperty({
    type: 'object',
    properties: {
      field: {
        type: 'string',
        enum: ['id', 'name', 'email', 'phone', 'birthDate', 'weight', 'height'],
        example: 'id',
        default: 'id',
      },
      direction: {
        type: 'string',
        enum: ['ASC', 'DESC'],
        example: 'ASC',
        default: 'ASC',
      },
    },
    required: false,
  })
  @IsOptional()
  sort: {
    field: keyof User;
    direction: 'ASC' | 'DESC';
  };

  @ApiProperty({ description: 'string searchable like', required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'string searchable like', required: false })
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'string searchable like',
    example: '+79876543210',
    required: false,
  })
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'search by specific date or within a period',
    oneOf: [
      { type: 'date', example: '2024-01-01' },
      {
        type: 'object ',
        properties: {
          lte: { type: 'date' },
          gte: { type: 'date' },
        },
        examples: [
          { lte: '2024-01-01' },
          { gte: '2001-09-11' },
          { lte: '2024-01-01', gte: '2001-09-11' },
        ],
      },
    ],
    required: false,
  })
  @IsOptional()
  @ValidateBy({
    name: 'birthDate',
    validator: {
      validate: (value: unknown) => {
        if (typeof value === 'string') {
          return isDateString(value);
        }

        if (typeof value === 'object') {
          return Object.values(value).some((propValue) =>
            isDateString(propValue),
          );
        }

        return false;
      },
      defaultMessage: (validationArguments?: ValidationArguments) => {
        return `${validationArguments?.property}: Data type mismatch`;
      },
    },
  })
  birthDate: string | Range<string>;

  @ApiProperty({
    description: 'search by specific value or within a period',
    oneOf: [
      { type: 'number', example: 1 },
      {
        type: 'object ',
        properties: {
          lte: { type: 'number' },
          gte: { type: 'number' },
        },
        examples: [{ lte: 1 }, { gte: 1 }, { lte: 1, gte: 1 }],
      },
    ],
    required: false,
  })
  @IsOptional()
  @ValidateBy({
    name: 'height',
    validator: {
      validate: (value: unknown) => {
        if (typeof value === 'number') {
          return Number(value) > 0;
        }

        if (typeof value === 'object') {
          return !Object.values(value).some(
            (propValue) => Number(propValue) < 0,
          );
        }

        return false;
      },
      defaultMessage: (validationArguments?: ValidationArguments) => {
        return `${validationArguments?.property}: Data type mismatch`;
      },
    },
  })
  height: number | Range<number>;

  @ApiProperty({
    description: 'search by specific value or within a period',
    oneOf: [
      { type: 'number', example: 1 },
      {
        type: 'object ',
        properties: {
          lte: { type: 'number' },
          gte: { type: 'number' },
        },
        examples: [{ lte: 1 }, { gte: 1 }, { lte: 1, gte: 1 }],
      },
    ],
    required: false,
  })
  @IsOptional()
  @ValidateBy({
    name: 'weigth',
    validator: {
      validate: (value: unknown) => {
        if (typeof value === 'number') {
          return Number(value) > 0;
        }

        if (typeof value === 'object') {
          return !Object.values(value).some(
            (propValue) => Number(propValue) < 0,
          );
        }

        return false;
      },
      defaultMessage: (validationArguments?: ValidationArguments) => {
        return `${validationArguments?.property}: Data type mismatch`;
      },
    },
  })
  weight: number | Range<number>;
}
