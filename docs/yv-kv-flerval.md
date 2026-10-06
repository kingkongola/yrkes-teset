# YV flerval till KV

Detta exempel visar den enklaste integrationen för kunden: ett YV-flerval som skickas vidare till KV.

## Regel i exemplet

- Om användaren väljer exakt ett yrke skickas yrket till KV och `af-popular` är `true`. Då visas rekommenderade/vanliga kompetenser för det yrket.
- Om användaren väljer flera yrken skickas yrkena till KV som sökkontext och `af-popular` är `false`. Då visas ingen rekommenderad lista, eftersom inget av yrkena ska vara viktigare än de andra.

## Mappning till KV:s nuvarande API

KV tar i dag emot kontext via två attribut:

```html
<digi-service-skill-selector
  [attr.af-occupation-id]="contextId1 || null"
  [attr.af-input-ids]="contextIds2To5 || null"
  [attr.af-popular]="showPopular ? 'true' : 'false'">
</digi-service-skill-selector>
```

Vid flera val är yrkena semantiskt lika viktiga. Att första id:t skickas via `af-occupation-id` är bara en teknisk mappning till KV:s nuvarande API. Eftersom `af-popular` är `false` visas ingen lista som får första yrket att se viktigare ut.

## Viktigt

Skicka Taxonomi concept-id:n, inte numeriska SSYK-koder som `2512`.

För `OccupationName`: använd occupation-name-id om KV känner igen det, annars SSYK level 4 concept-id som fallback.

För `JobTitle`: använd inte job-title-id:t som KV-kontext. Använd kopplat occupation-name-id om det finns, annars SSYK level 4 concept-id.
