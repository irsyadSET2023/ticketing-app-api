import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRequest, VerifyRequest } from './request';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponse, RegisterResponse } from './response';
import { generateRandomString } from 'src/helper';
import { Emailhtml, sendEmailDev } from 'src/services/email';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(authRequest: AuthRequest) {
    try {
      const hashPassword = await argon.hash(authRequest.password);
      let verificationToken = await this.generateUniqueToken(8);
      const usersList = this.prisma.user.findMany();
      (await usersList).forEach((user) => {
        if (user.token === verificationToken) {
          verificationToken = generateRandomString(8);
        }
      });
      const user = await this.prisma.user.create({
        data: {
          ...authRequest,
          password: hashPassword,
          token: verificationToken,
          role: 'SUPER_ADMIN',
        },
      });

      const emailHtml = Emailhtml(verificationToken, 'url');
      await sendEmailDev(
        '',
        authRequest.email,
        'Welcome to Organization',
        'Welcome to Organization Text',
        emailHtml,
      );
      return RegisterResponse(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async verifyUser(verifyRequest: VerifyRequest) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          token: verifyRequest.validationToken,
        },
      });
      if (!user) throw new NotFoundException('User Not found');

      const verifiedUser = await this.prisma.user.update({
        where: {
          token: verifyRequest.validationToken,
        },
        data: {
          is_validate: true,
        },
      });
      return verifiedUser;
    } catch (error) {
      throw error;
    }
  }

  async login(authRequest: AuthRequest) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: authRequest.email,
        },
      });

      if (!user) throw new ForbiddenException('Invalid Credentials');

      const verifyPassword = await argon.verify(
        user.password,
        authRequest.password,
      );

      if (!verifyPassword) throw new ForbiddenException('Invalid Credentials');
      const signToken = await this.signToken(
        user.id,
        user.email,
        user.organization_id,
      );
      return LoginResponse(user, signToken);
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
    organizationId: number | null,
  ): Promise<String> {
    const payload = {
      userId,
      email,
      organizationId,
    };

    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '3600m',
      secret: secret,
    });
  }

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
}
