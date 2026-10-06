import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Importera loaders enligt README
import { defineCustomElements as defineDigi } from '@designsystem-se/af/loader';
import { defineCustomElements as defineSkillSelector } from '@taxonomy/kompetensvaljaren/loader';
import { registerSkills } from '@taxonomy/kompetensvaljaren';
import { loadBase } from '@taxonomy/kompetensvaljaren-data-v27';
import { defineCustomElements as defineYrkesvaljaren } from '@taxonomy/yrkesvaljaren/loader';

async function main(): Promise<void> {
  // Ladda designsystemets komponenter FÖRST
  defineDigi(window);

  // Ladda väljarna EFTERÅT
  defineSkillSelector(window);
  defineYrkesvaljaren(window);

  const skillsBase = await loadBase({
    basePath: 'assets/kompetensvaljaren/'
  });

  (window as any).__kvBase = skillsBase;

  registerSkills(skillsBase);

  await platformBrowserDynamic().bootstrapModule(AppModule);
}

main().catch(err => console.error(err));
