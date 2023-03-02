import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Ideas {
  setting: string[];
  story: string[];
  image: string;
}

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.css']
})
export class IdeasComponent {
  prompt: string = '';
  selectedSetting : string ='';
  selectedGenre: string = '';
  selectedTheme: string = '';
  genreSelected = false;
  settingSelected = false;
  themeSelected = false

  ideas: Ideas = {
    setting: [],
    story: [],
    image: '',
  };

  themes = [
    'Climate change',
    'Deforestation',
    'Pollution',
    'Loss of biodiversity',
    'Water scarcity',
    'Digital pollution',
    'Transportation',
    'Renewable energy',
    'Fast Fashion',
  ];

  genres = [
    'Action',
    'Adventure',
    'Fighting',
    'Platform',
    'Puzzle',
    'Racing',
    'Role-Playing',
    'Shooter',
    'Simulation',
    'Sports',
    'Strategy',
  ]

  settings = [
    'Post-apocalyptic world',
    'Dystopia',
    'Sci-fi',
    'Fantasy',
    'Battlefield',
  ]

  constructor(private http: HttpClient) {}
  
  generateIdeas(genre: string, theme: string, setting: string) {
    this.selectedGenre = genre;
    this.selectedTheme = theme;
    this.selectedSetting = setting;

    this.settingSelected = true;

    const apiKey = environment.apiKey;
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    const imageApiUrl = 'https://api.openai.com/v1/images/generations';
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${apiKey}`);

    const storyPrompt = `Write a ${this.selectedGenre.toLowerCase()} video game story set in a ${this.selectedSetting.toLowerCase()} with this environmental issue as a theme:${this.selectedTheme.toLowerCase()}`
    this.generateIdea(apiUrl, headers, `${storyPrompt}`, 3, 'story',256);

    // Generate an image based on the prompts
    this.generateImage(imageApiUrl, headers, `${storyPrompt}`);
  }

  selectGenre(genre: string) {
    this.selectedGenre = genre;
    this.genreSelected = true;
  }

  selectTheme(theme: string) {
      this.selectedTheme = theme;
      this.themeSelected = true;
  }



  generateIdea(apiUrl: string, headers: HttpHeaders, prompt: string, numIdeas: number, element: string, maxTokens: number) {
    const requestBody = {
      prompt: prompt,
      max_tokens: maxTokens,
      n: numIdeas,
      stop: ['\n', '}'],
      temperature: 0.7,
    };
    this.http.post<any>(apiUrl, requestBody, { headers }).subscribe(response => {
      let ideas = response.choices.map((choice: { text: string; }) => choice.text.trim());


      // Filter out any names
      if (element === 'name') {
        ideas = ideas.filter((idea: string) => {
          const numWords = idea.split(' ').length;
          return numWords >= 1 && numWords <= 2;
        });
      }
    
      this.ideas[element as keyof Ideas] = ideas;
    });
  }

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
}
