import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationRequest } from './request';
import { generateRandomString } from 'src/helper';
import { OrganizationResponse } from './response';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}
  async createOrganization(
    userId: number,
    createOrganization: CreateOrganizationRequest,
  ) {
    try {
      return this.prisma.$transaction(async (prisma) => {
        //create organization
        const organization = await prisma.organization.create({
          data: {
            ...createOrganization,
            users: {
              connect: {
                id: userId,
              },
            },
          },
        });
        return OrganizationResponse(organization);
      });
    } catch (error) {
      throw error;
    }
  }

  async getOrganizationDetails(organizationId: number) {
    try {
      const organizationData = await this.prisma.organization.findUnique({
        where: {
          id: organizationId,
        },
        include: {
          users: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });
      return organizationData;
    } catch (error) {
      throw error;
    }
  }

  async generateOrganizationKey(organizationId: number) {
    const organizationKey = await this.generateUniqueApiKey(16);
    const organizationUpdateData = await this.prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        api_key: organizationKey,
      },
    });
    return OrganizationResponse(organizationUpdateData);
  }

  async generateUniqueApiKey(length: number): Promise<string> {
    const apiKey = generateRandomString(length);

    const existingApiKey = await this.prisma.organization.findFirst({
      where: {
        api_key: apiKey,
      },
    });

    if (existingApiKey) {
      return this.generateUniqueApiKey(length);
    }

    return apiKey;
  }
}
