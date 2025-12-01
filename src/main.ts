import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Importera loaders enligt README
import { defineCustomElements as defineDigi } from '@designsystem-se/af/loader';
import { defineCustomElements as defineYrkesvaljaren } from '@taxonomy/yrkesvaljaren/loader';

// Ladda designsystemets komponenter FÖRST
defineDigi(window);

// Ladda yrkesväljaren EFTERÅT
defineYrkesvaljaren(window);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));