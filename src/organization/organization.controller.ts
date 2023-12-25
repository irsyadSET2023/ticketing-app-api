import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CreateOrganizationRequest } from './request';
import { UserRequest } from 'src/user/request';
import { Request } from 'express';
import { OrganizationService } from './organization.service';
import { parseMessage } from 'src/helper';

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(
    @Req() req: Request,
    @Body() createOrganizationRequest: CreateOrganizationRequest,
  ) {
    const user = req.user as UserRequest;
    const userId = user.userId;
    const organizationData = await this.organizationService.createOrganization(
      userId,
      createOrganizationRequest,
    );
    return parseMessage(organizationData, 'Organization Created');
  }

  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrganization(@Req() req: Request) {
    const user = req.user as UserRequest;
    const organizationId = user.organizationId;
    const organizationData =
      await this.organizationService.getOrganizationDetails(organizationId);
    return parseMessage(organizationData, 'Organization Details');
  }

  @UseGuards(JwtGuard)
  @Put('generate-key')
  @HttpCode(HttpStatus.CREATED)
  async generateOrganizationKey(@Req() req: Request) {
    const user = req.user as UserRequest;
    const organizationId = user.organizationId;

    const organizationData =
      await this.organizationService.generateOrganizationKey(organizationId);
    return parseMessage(organizationData, 'Api Key Organization Created');
  }
}
