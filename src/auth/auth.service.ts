import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRequest } from './request';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponse, RegisterResponse } from './response';
import { response } from 'express';
import { parseMessage } from 'src/helper';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: AuthRequest) {
    try {
      const hashPassword = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashPassword,
        },
      });
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
  async login(dto: AuthRequest) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) throw new ForbiddenException('Invalid Credentials');

      const verifyPassword = await argon.verify(user.password, dto.password);

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
}
