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
import { UserService } from './user.service';
import { parseMessage } from 'src/helper';
import { Request } from 'express';
import {
  InviteOrganizationMemberRequest,
  UserRequest,
  UserUpdateRequest,
} from './request';
import { UpdateAccountResponse } from './response';
import { UserRole } from './enum';
import { RolesGuard } from './middleware/role.guard';
import { Roles } from './middleware/role.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('my-account')
  @HttpCode(HttpStatus.OK)
  async myAccount(@Req() req: Request) {
    const user = req.user as UserRequest;
    const userId = user.userId;
    const myAccount = await this.userService.getMyAccount(userId);
    return parseMessage(myAccount, 'My-Account');
  }
  @UseGuards(JwtGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Req() req: Request,
    @Body() userUpdateRequest: UserUpdateRequest,
  ) {
    const user = req.user as UserRequest;
    const userId = user.userId;
    const updateData = await this.userService.updateUserAccount(
      userId,
      userUpdateRequest,
    );
    return parseMessage(UpdateAccountResponse(updateData), 'Account Updated');
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post('invite-member')
  @HttpCode(HttpStatus.CREATED)
  async inviteOrganizationMember(
    @Req() req: Request,
    @Body() inviteOrganizationMemberRequest: InviteOrganizationMemberRequest,
  ) {
    const user = req.user as UserRequest;
    const superAdminEmail = user.email;
    const organizationId = user.organizationId;

    const memberList = inviteOrganizationMemberRequest.memberList;

    const newOrganizationMembers = await this.userService.inviteMember(
      superAdminEmail,
      memberList,
      organizationId,
    );
    return parseMessage(
      newOrganizationMembers,
      `${memberList.length} members invited`,
    );
  }
}
