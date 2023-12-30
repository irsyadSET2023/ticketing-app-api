import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TicketPriority } from '../enum';

export class CreateTicketRequest {
  @IsString()
  @IsNotEmpty()
  message: string;
  @IsString()
  @IsNotEmpty()
  platform: string;
  @IsEmail()
  @IsNotEmpty()
  sender_email: string;
  @IsOptional()
  @IsEnum(TicketPriority)
  category: TicketPriority;
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}

export class UpdateTicketRequest {
  @IsOptional()
  @IsEnum(TicketPriority)
  category: TicketPriority;
  @IsOptional()
  @IsString()
  status: string;
}

export class AssignTicketRequest {
  @IsArray()
  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  membersId: number[];
}
