import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
}
