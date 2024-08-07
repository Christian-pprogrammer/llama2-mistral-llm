import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message {
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  timestamp: Date;
}

@Schema()
export class Conversation extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  modal: string;

  @Prop({ required: true })
  created_at: Date;

  @Prop({ type: [Message] })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);