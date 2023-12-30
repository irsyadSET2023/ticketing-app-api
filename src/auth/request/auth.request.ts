import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class AuthRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(8)
  password: string;
  @IsOptional()
  @IsString()
  username: string;
}

export class VerifyRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  validationToken: string;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;
}
