import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmController } from './llm/llm.controller';
import { LlmService } from './llm/llm.service';
import { ConversationModule } from './conversation/conversation.module';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://llm_user:mnbvcxz@127.0.0.1:27017/llm_conversations', {
        authSource: 'admin'
    }),
    ConversationModule
  ],
  controllers: [AppController, LlmController],
  providers: [AppService, LlmService],
})
export class AppModule {}