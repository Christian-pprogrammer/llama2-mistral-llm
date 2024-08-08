import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from '../schema/conversation.schema';
import axios from 'axios';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
  ) {}

  async createConversation(model: string, query: string): Promise<Conversation> {
    const response = await this.generateResponse(model, query);
    
    const conversation = new this.conversationModel({
      title: query.substring(0, 50), // Use first 50 characters of query as title
      modal: model,
      created_at: new Date(),
      messages: [
        { role: 'user', content: query, timestamp: new Date() },
        { role: 'assistant', content: response, timestamp: new Date() },
      ],
    });

    return conversation.save();
  }

  async continueConversation(conversationId: string, query: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const response = await this.generateResponse(conversation.modal, query, conversationId);

    conversation.messages.push(
      { role: 'user', content: query, timestamp: new Date() },
      { role: 'assistant', content: response, timestamp: new Date() },
    );

    return conversation.save();
  }

  async listConversations(): Promise<Conversation[]> {
    return this.conversationModel.find().sort({ created_at: -1 }).exec();
  }

  async getConversationDetails(conversationId: string): Promise<Conversation> {
    return this.conversationModel.findById(conversationId).exec();
  }

  private async generateResponse(model: string, query: string, conversationId?: string): Promise<string> {
    const flaskApiUrl = 'http://flask_app:5000/generate'; // Update this URL if your Flask API is hosted elsewhere
    const response = await axios.post(flaskApiUrl, {
      model,
      query,
      conversation_id: conversationId,
    });

    return response.data.response;
  }
}