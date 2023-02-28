import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  constructor(private http : HttpClient) { }

  /*
  generateImage(apiUrl: string, headers: HttpHeaders, prompt: string) {
    const requestBody = {
      "model": "image-alpha-001",
      "prompt": prompt,
      "num_images": 1,
      "size": "512x512",
      "response_format": "url"
    };
    this.http.post<any>(apiUrl, requestBody, { headers }).subscribe(response => {
      this.ideas.image = response.data[0].url;
    });
  }
  */
}
