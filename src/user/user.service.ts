import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MyAccountResponse } from './response';
import * as argon from 'argon2';
import { MemberEntryRequest, UserUpdateRequest } from './request';
import { Emailhtml, sendEmailDev } from 'src/services/email';

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

  async inviteMember(memberList: MemberEntryRequest[], organizationId: number) {
    try {
      const createOrganizationMembersData = memberList.map((member) => {
        return {
          ...member,
          organization_id: organizationId,
        };
      });
      const newOrganizationMembers = await this.prisma.user.createMany({
        data: createOrganizationMembersData,
      });

      await Promise.all(
        memberList.map(async (member) => {
          const emailHtml = Emailhtml('userverificationtoken', 'userurl');
          await sendEmailDev(
            '',
            member.email,
            'Welcome to Organization',
            'Welcome to Organization Text',
            emailHtml,
          );
        }),
      );

      return newOrganizationMembers;
    } catch (error) {}
  }

  async userForgotPassword() {}
}
