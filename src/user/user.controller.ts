import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { parseMessage } from 'src/helper';
import { Request } from 'express';
import { UserRequest, UserUpdateRequest } from './request';
import { UpdateAccountResponse } from './response';

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
  async updateController(
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
}
