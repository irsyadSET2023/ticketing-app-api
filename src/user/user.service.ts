import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MyAccountResponse } from './response';
import * as argon from 'argon2';
import { MemberEntryRequest, UserUpdateRequest } from './request';
import { Emailhtml, sendEmailDev } from 'src/services/email';
import { generateRandomString } from 'src/helper';

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

  async inviteMember(
    superAdminEmail: string,
    memberList: MemberEntryRequest[],
    organizationId: number,
  ) {
    try {
      await this.checkExistingEmail(memberList);
      const newOrganizationMembersData = [];
      await Promise.all(
        memberList.map(async (member) => {
          const token = await this.generateUniqueToken(8);
          const newMemberData = {
            ...member,
            token,
            organization_id: organizationId,
          };
          newOrganizationMembersData.push(newMemberData);
        }),
      );

      const newOrganizationMembers = await this.prisma.user.createMany({
        data: newOrganizationMembersData,
      });

      await Promise.all(
        newOrganizationMembersData.map(async (newMember) => {
          const emailHtml = Emailhtml(newMember.token, 'userurl');
          await sendEmailDev(
            superAdminEmail,
            newMember.email,
            'Welcome to Organization',
            'Welcome to Organization Text',
            emailHtml,
          );
        }),
      );

      return newOrganizationMembers;
    } catch (error) {
      throw error;
    }
  }

  async userForgotPassword() {}

  async generateUniqueToken(length: number): Promise<string> {
    const verificationToken = generateRandomString(length);

    const existingUser = await this.prisma.user.findFirst({
      where: {
        token: verificationToken,
      },
    });

    if (existingUser) {
      return this.generateUniqueToken(length);
    }

    return verificationToken;
  }

  async checkExistingEmail(memberList: MemberEntryRequest[]) {
    const memberEmails = memberList.map((member) => {
      return member.email;
    });

    const existingUsersEmails = await this.prisma.user.findMany({
      where: {
        email: {
          in: memberEmails,
        },
      },
    });

    console.log(existingUsersEmails);

    if (existingUsersEmails.length > 0) {
      const existingEmails = existingUsersEmails.map((user) => user.email);
      throw new NotFoundException({
        message: 'Emails already exist',
        existingEmails,
      });
    }
    return true;
  }
}
