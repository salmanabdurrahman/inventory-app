import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(255, { message: 'Name must be less than 255 characters' })
  name: string;

  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^[0-9+\-\s()]+$/, { message: 'Phone must be a valid phone number' })
  @MaxLength(20, { message: 'Phone must be less than 20 characters' })
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email must be less than 255 characters' })
  email?: string;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(500, { message: 'Address must be less than 500 characters' })
  address: string;
}
