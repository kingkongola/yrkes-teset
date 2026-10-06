# Angular-exempel: YV flerval till KV

Det här är ett minimalt Angular-exempel som visar hur ett flerval från Yrkesväljaren (YV) skickas vidare som yrkeskontext till Kompetensväljaren (KV).

Exemplet är avsiktligt smalt:

- en YV-komponent med flerval
- en KV-komponent
- debug-rutor som visar YV-resultat, KV-kontext och KV-resultat

Det finns inget enkelval och inget playground i exemplet.

## Starta lokalt

```bash
npm install
npm start
```

Öppna:

```txt
http://localhost:4200/
```

## Paketversioner

Kontrollera versioner med:

```bash
npm ls @taxonomy/kompetensvaljaren @taxonomy/kompetensvaljaren-data-v27 @taxonomy/yrkesvaljaren
```

KV ska använda minst:

```txt
@taxonomy/kompetensvaljaren@0.1.8
@taxonomy/kompetensvaljaren-data-v27@0.1.8
```

Det behövs eftersom `loadBase({ basePath })` används.

## KV-data som Angular asset

I `angular.json` exponeras KV-datapaketets JSON-filer som assets:

```json
{
  "glob": "**/*.json",
  "input": "node_modules/@taxonomy/kompetensvaljaren-data-v27/dist",
  "output": "/assets/kompetensvaljaren"
}
```

Då finns basefilen lokalt här:

```txt
http://localhost:4200/assets/kompetensvaljaren/kv-base.v1.json
```

I deploy ska motsvarande URL finnas under appens base path, till exempel:

```txt
https://example.se/min-app/assets/kompetensvaljaren/kv-base.v1.json
```

Om den URL:en svarar med HTML (`<!DOCTYPE html>`) i stället för JSON är filerna inte korrekt deployade, eller så rewritas asset-requesten till appens fallback-sida.

## Ladda KV-data i `src/main.ts`

Exemplet laddar komponenterna och registrerar KV-data innan Angular startas:

```ts
defineDigi(window);
defineSkillSelector(window);
defineYrkesvaljaren(window);

const skillsBase = await loadBase({
  basePath: 'assets/kompetensvaljaren/'
});

registerSkills(skillsBase);
```

`basePath` är relativ. Lokalt blir det `/assets/kompetensvaljaren/`. I deploy resolve:as den relativt appens `<base href>`.

Lägg inte app-prefix som `/min-app` i Angulars `assets.output`. Prefixet ska komma från `<base href>` eller från den asset-URL som används i deploy.

## Regeln för YV flerval

Kundens flerval betyder att alla valda yrken är lika viktiga. Därför använder exemplet denna regel:

- exakt ett valt yrke: `af-popular` sätts till `true` och KV visar rekommenderade/vanliga kompetenser för yrket
- flera valda yrken: `af-popular` sätts till `false` och KV visar ingen rekommenderad lista

Vid flera val används yrkena fortfarande som sökkontext. Den rekommenderade listan stängs bara av för att inget av yrkena ska framstå som viktigare än de andra.

## Mappning till KV:s nuvarande API

KV tar i dag emot upp till fem kontext-id:n via två attribut:

```html
<digi-service-skill-selector
  [attr.af-occupation-id]="selectedOccupationId || null"
  [attr.af-input-ids]="selectedInputIds || null"
  [attr.af-popular]="showPopular ? 'true' : 'false'">
</digi-service-skill-selector>
```

Tekniskt skickas första context-id:t via `af-occupation-id` och upp till fyra ytterligare via `af-input-ids`.

Vid flera val betyder det inte att första yrket är viktigare. Det är bara en mappning till KV:s nuvarande API. Eftersom `af-popular=false` vid flera val visas ingen lista som favoriserar första yrket.

## Vilka id:n ska skickas?

Skicka Taxonomi concept-id:n, inte numeriska SSYK-koder som `2512`.

För `OccupationName`:

1. använd occupation-name-id om KV känner igen det
2. annars använd SSYK level 4 concept-id som fallback

För `JobTitle`:

1. använd kopplat `occupation_name.id` om det finns
2. annars använd SSYK level 4 concept-id som fallback

Skicka inte job-title-id:t direkt som KV-kontext.

## Felsökning

### `GET /kv-base.v1.json 404` lokalt

Då kör appen troligen `loadBase()` utan fungerande `basePath`, eller med för gammalt datapaket. Kontrollera `src/main.ts` och paketversionerna.

### Deploy svarar med `text/html` eller `<!DOCTYPE html>`

Då försöker KV läsa JSON men servern svarar med HTML. Kontrollera att denna URL returnerar JSON direkt i browsern:

```txt
<appens-base-url>/assets/kompetensvaljaren/kv-base.v1.json
```

Förväntat är `Status: 200` och `Content-Type: application/json`.

### Flera yrken visar inte rekommenderade kompetenser

Det är avsiktligt. Rekommenderade kompetenser baseras på ett yrke. Vid flera lika viktiga yrken stänger exemplet av listan och använder yrkena som sökkontext.

## Viktiga filer

- `src/main.ts`: loader-setup, `loadBase`, `registerSkills`
- `angular.json`: asset-konfiguration för KV-data
- `src/app/app.component.ts`: YV till KV-mappning och regeln för `af-popular`
- `src/app/app.component.html`: komponenterna och attributen
- `docs/yv-kv-flerval.md`: kort sammanfattning
