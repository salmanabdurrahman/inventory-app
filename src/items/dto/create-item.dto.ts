import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  Min,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateItemDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(255, { message: 'Name must be less than 255 characters' })
  name: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsOptional()
  @IsNumber({}, { message: 'Supplier ID must be a number' })
  @IsPositive({ message: 'Supplier ID must be a positive number' })
  supplierId?: number;
}
