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
    MongooseModule.forRoot(process.env.MONGODB_URI, {
        authSource: 'admin'
    }),
    ConversationModule
  ],
  controllers: [AppController, LlmController],
  providers: [AppService, LlmService],
})
export class AppModule {}