import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../enum';

export interface UserRequest {
  userId: number;
  email: string;
  organizationId: number | null;
}

export class UserUpdateRequest {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(8)
  password: string;
  @IsOptional()
  @IsString()
  username: string;
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
