import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketRequest } from './request';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createTicket(apiKey: string, createTicket: CreateTicketRequest) {
    try {
      return this.prisma.$transaction(async (prisma) => {
        //create organization

        const organization = await prisma.organization.findUnique({
          where: {
            api_key: apiKey,
          },
          select: {
            id: true,
          },
        });

        if (!organization) {
          throw new NotFoundException('Organization Not Found');
        }
        delete createTicket.apiKey;
        const ticket = await this.prisma.ticket.create({
          data: {
            ...createTicket,
            organization: {
              connect: {
                id: organization.id,
              },
            },
          },
        });
        return ticket;
      });
    } catch (error) {
      throw error;
    }
  }

  async getOrganizationTicket(organizationId: number) {
    try {
      const organizationTicket = await this.prisma.ticket.findMany({
        where: {
          organization_id: organizationId,
        },
      });

      return organizationTicket;
    } catch (error) {
      throw error;
    }
  }

  async assignTicketToMembers(ticketId: number, membersId: number[]) {
    const membersAssignedTicketData = membersId.map((memberId) => {
      return {
        user_id: memberId,
        ticket_id: ticketId,
      };
    });
    const membersAssignedTicket = this.prisma.userAssignedTicket.createMany({
      data: membersAssignedTicketData,
    });
    return membersAssignedTicket;
  }

  async getAssignedMemberTicket(memberId: number) {
    const memberAssignedTicket = await this.prisma.userAssignedTicket.findMany({
      where: {
        user_id: memberId,
      },
      select: {
        ticket: true,
      },
    });
    return memberAssignedTicket;
  }

  async updateTicket(ticketId: number) {
    try {
      await this.prisma.ticket.update({
        where: {
          id: ticketId,
        },
        data: {},
      });
    } catch (error) {}
  }

  async deleteTicket(ticketId: number) {
    try {
      await this.prisma.ticket.delete({
        where: {
          id: ticketId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
