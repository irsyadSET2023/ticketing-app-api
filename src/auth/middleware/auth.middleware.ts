import { UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isVerified = async (userEmail: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (user.is_validate) {
      return true;
    } else {
      throw new UnauthorizedException('Please Validate the account first');
    }
  } catch (error) {
    throw error;
  }
};
