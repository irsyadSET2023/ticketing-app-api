import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtGuard } from 'src/auth/guard';
import { AssignTicketRequest, CreateTicketRequest } from './request';
import { parseMessage } from 'src/helper';
import { Request } from 'express';
import { UserRequest } from 'src/user/request';
import { Roles, RolesGuard } from 'src/user/middleware';
import { UserRole } from 'src/user/enum';

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTicket(@Body() createticketRequest: CreateTicketRequest) {
    const apiKey = createticketRequest.apiKey;
    const ticketData = await this.ticketService.createTicket(
      apiKey,
      createticketRequest,
    );
    return parseMessage(ticketData, 'Ticket is created');
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrganizationTicket(@Req() req: Request) {
    const user = req.user as UserRequest;
    const organizationId = user.organizationId;
    const organizationTicket =
      await this.ticketService.getOrganizationTicket(organizationId);
    return parseMessage(organizationTicket, 'Your Organization Ticket');
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put(':ticketId')
  @HttpCode(HttpStatus.OK)
  async assignTicketToMembers(
    @Body() assignTicketRequest: AssignTicketRequest,
    @Param('ticketId') ticketId: string,
  ) {
    const membersId = assignTicketRequest.membersId;
    const membersAssignedTicket =
      await this.ticketService.assignTicketToMembers(
        Number(ticketId),
        membersId,
      );
    return parseMessage(
      membersAssignedTicket,
      `Ticket ${ticketId} has been assigned`,
    );
  }

  @UseGuards(JwtGuard)
  @Get('/assigned')
  @HttpCode(HttpStatus.OK)
  async getMemberTicketAssigned(@Req() req: Request) {
    const user = req.user as UserRequest;
    const memberId = user.userId;
    const memberAssignedTicket =
      await this.ticketService.getAssignedMemberTicket(memberId);

    return parseMessage(memberAssignedTicket, 'List of Assigned Ticket');
  }

  @UseGuards(JwtGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put(':ticketId')
  @HttpCode(HttpStatus.OK)
  async updateTicket(@Param('ticketId') ticketId: string) {}

  @UseGuards(JwtGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':ticketId')
  @HttpCode(HttpStatus.OK)
  async deleteTicket(@Param('ticketId') ticketId: string) {
    await this.ticketService.deleteTicket(Number(ticketId));
    return parseMessage([], `Ticket ${ticketId} is deleted`);
  }
}
