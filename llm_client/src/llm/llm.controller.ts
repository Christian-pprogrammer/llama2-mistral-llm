import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service';
import { Observable } from 'rxjs';

@Controller('llm')
export class LlmController {
  constructor(private llmService: LlmService) {}

  @Post('generate')
  generateResponse(
    @Body('model') model: string,
    @Body('query') query: string,
  ): Observable<string> {
    return this.llmService.generateResponse(model, query);
  }

  
}