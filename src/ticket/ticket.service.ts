import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketRequest } from './request';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createTicket(
    userId: number,
    organizationId: number,
    createTicket: CreateTicketRequest,
  ) {
    try {
      return this.prisma.$transaction(async (prisma) => {
        //create organization
        const ticket = await prisma.ticket.create({
          data: {
            ...createTicket,
            user: {
              connect: {
                id: userId,
              },
            },
            organization: {
              connect: {
                id: organizationId,
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

  getTicket(ticketId: number) {
    try {
    } catch (error) {
      throw error;
    }
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
