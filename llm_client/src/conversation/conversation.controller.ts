import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('create')
  async createConversation(@Body() body: { model: string; query: string }) {
    return this.conversationService.createConversation(body.model, body.query);
  }

  @Post('continue/:id')
  async continueConversation(
    @Param('id') id: string,
    @Body() body: { query: string },
  ) {
    return this.conversationService.continueConversation(id, body.query);
  }

  @Get('list')
  async listConversations() {
    return this.conversationService.listConversations();
  }

  @Get(':id')
  async getConversationDetails(@Param('id') id: string) {
    return this.conversationService.getConversationDetails(id);
  }
}