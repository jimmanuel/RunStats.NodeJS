import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface IAppConfig {
  googleApiKey : string;
  googleClientId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private appConfig : IAppConfig | null = null;

  constructor(private httpClient: HttpClient) { }

  getGoogleClientId(): string {
    if (!this.appConfig) {
      return '';
    }
    return this.appConfig.googleClientId;
  }
  getGoogleApiKey(): string {
    if (!this.appConfig) {
      return '';
    }
    return this.appConfig.googleApiKey;
  }

  public async loadValues() : Promise<void>{

    if (this.appConfig) {
      return;
    }

    try {
      const results = await this.httpClient.get(`/api/config`, { headers : { 'Accept-Type' : 'application/json'}}).toPromise();
      console.log(JSON.stringify(results));
      
      this.appConfig = <IAppConfig>results;
      console.log(JSON.stringify(this.appConfig));

    } catch(error) {
      console.log(JSON.stringify(error))
      throw error;
    }
  }
}
