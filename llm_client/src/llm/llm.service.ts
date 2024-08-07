import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class LlmService {
  constructor(private httpService: HttpService) {}

  generateResponse(model: string, query: string): Observable<string> {
    const payload = { model, query };
    return this.httpService
      .post('http://localhost:5000/generate', payload)
      .pipe(map((response) => response.data.response));
  }
}