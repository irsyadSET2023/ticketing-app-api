import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MyAccountResponse } from './response';
import * as argon from 'argon2';
import { UserUpdateRequest } from './request';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMyAccount(userId: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          organization: true,
        },
      });
      return MyAccountResponse(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUserAccount(
    userId: number,
    userUpdateRequest: UserUpdateRequest,
  ) {
    try {
      let columns = {};
      for (const [key, value] of Object.entries(userUpdateRequest)) {
        if (key === 'password') {
          const hashPassword = await argon.hash(userUpdateRequest.password);
          columns[key] = hashPassword;
        } else {
          columns[key] = value;
        }
      }
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: { ...columns },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async userForgotPassword() {}

  async inviteMember() {}
}
