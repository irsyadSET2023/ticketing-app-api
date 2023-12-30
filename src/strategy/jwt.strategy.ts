import { Injectable, Next, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: {
    userId: number;
    email: string;
    organizationId: number | null;
  }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });
      if (!user) throw UnauthorizedException;
      //get organizationId from database
      return {
        ...payload,
        organizationId: user.organization_id,
        role: user.role,
      };
    } catch (error) {
      throw error;
    }
  }
}
