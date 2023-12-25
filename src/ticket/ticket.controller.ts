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
import { Request } from 'express';
import { CreateTicketRequest } from './request';
import { UserRequest } from 'src/user/request';
import { parseMessage } from 'src/helper';

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTicket(
    @Req() req: Request,
    @Body() createticketRequest: CreateTicketRequest,
  ) {
    const user = req.user as UserRequest;
    const userId = user.userId;
    const organizationId = user.organizationId;
    console.log(createticketRequest);
    const ticketData = await this.ticketService.createTicket(
      userId,
      organizationId,
      createticketRequest,
    );
    return parseMessage(ticketData, 'Ticket is created');
  }

  @UseGuards(JwtGuard)
  @Get('organization/:organizationId')
  @HttpCode(HttpStatus.OK)
  async getTicketByOrganization(@Param('organizationId') ticketId: number) {}

  @UseGuards(JwtGuard)
  @Get('/assigned')
  @HttpCode(HttpStatus.OK)
  async getMemberTicketAssigned() {}

  @UseGuards(JwtGuard)
  @Put(':ticketId')
  @HttpCode(HttpStatus.OK)
  async updateTicket(@Param('ticketId') ticketId: string) {}

  @UseGuards(JwtGuard)
  @Put(':ticketId/:userId')
  @HttpCode(HttpStatus.OK)
  async assignTicketToMember(@Param('ticketId') ticketId: string) {}

  @UseGuards(JwtGuard)
  @Delete(':ticketId')
  @HttpCode(HttpStatus.OK)
  async deleteTicket(@Param('ticketId') ticketId: string) {
    await this.ticketService.deleteTicket(Number(ticketId));
    return parseMessage([], `Ticket ${ticketId} is deleted`);
  }
}
