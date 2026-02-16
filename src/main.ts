import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

console.log('Bootstrapping Angular app with appConfig:', appConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
